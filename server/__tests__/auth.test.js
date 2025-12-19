// server/__tests__/auth.test.mjs
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../test-app.js";
import User from "../models/User.js";

let mongo;

beforeAll(async () => {
  // In-memory Mongo
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // Connect Mongoose to test DB
  await mongoose.connect(uri, {
    dbName: "jest-auth-tests",
  });

  // Make sure JWT has *some* secret
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
});

afterEach(async () => {
  // Clean DB between tests
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Auth API", () => {
  test("signup creates a new user with role 'user' by default", async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Dillon",
        email: "dillon@example.com",
        password: "test1234",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name", "Dillon");
    expect(res.body).toHaveProperty("email", "dillon@example.com");

    // Check DB
    const user = await User.findOne({ email: "dillon@example.com" });
    expect(user).not.toBeNull();
    expect(user.role).toBe("user"); // default role
    // Password should be hashed (not equal to plain text)
    expect(user.password).not.toBe("test1234");
  });

  test("signup rejects duplicate email", async () => {
    // First signup
    await request(app).post("/api/users/signup").send({
      name: "Bob",
      email: "bob@example.com",
      password: "secret123",
    });

    // Second signup, same email
    const res = await request(app).post("/api/users/signup").send({
      name: "Bobby",
      email: "bob@example.com",
      password: "secret456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message).toBeTruthy();
  });

  test("signin succeeds with valid credentials and returns token + user", async () => {
    // Create user first
    await request(app).post("/api/users/signup").send({
      name: "Carol",
      email: "carol@example.com",
      password: "mypassword",
    });

    // Now sign in
    const res = await request(app).post("/api/auth/signin").send({
      email: "carol@example.com",
      password: "mypassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject({
      email: "carol@example.com",
      name: "Carol",
    });
  });

  test("signin fails with wrong password", async () => {
    await request(app).post("/api/users/signup").send({
      name: "Dave",
      email: "dave@example.com",
      password: "goodpass",
    });

    const res = await request(app).post("/api/auth/signin").send({
      email: "dave@example.com",
      password: "badpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error || res.body.message).toBeTruthy();
  });

  test("signin fails for unknown email", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "nobody@example.com",
      password: "anything",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error || res.body.message).toBeTruthy();
  });

  test("existing admin user keeps role 'admin'", async () => {
    // Seed admin directly in DB
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // will be hashed by pre-save
      role: "admin",
    });

    const res = await request(app).post("/api/auth/signin").send({
      email: "admin@example.com",
      password: "admin123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    // signin might not return role; we can confirm via DB:
    const fresh = await User.findById(admin._id);
    expect(fresh.role).toBe("admin");
  });
});