// server/__tests__/contacts.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../test-app.js';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import { connectDB } from "../db.js";
import { jest } from '@jest/globals';

jest.setTimeout(30000);

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  if (!uri) throw new Error("No test Mongo URI set");

  await connectDB(uri);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Contact.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

async function createUserAndToken({ name, email, password, role = 'user' }) {
  const user = await User.create({ name, email, password, role });

  const res = await request(app)
    .post('/api/auth/signin')
    .send({ email, password })
    .expect(200);

  return { user, token: res.body.token };
}


describe('Contacts API', () => {
  it('POST /api/contacts stores a message without auth', async () => {
    const payload = {
      firstname: 'Jacob',
      lastname: 'Beaumont',
      email: 'jacob@example.com',
      message: 'Hello, I love your portfolio!',
    };

    const res = await request(app)
      .post('/api/contacts')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('firstname', payload.firstname);
    expect(res.body).toHaveProperty('message', payload.message);

    const inDb = await Contact.findOne({ email: 'jacob@example.com' });
    expect(inDb).not.toBeNull();
    expect(inDb.message).toBe(payload.message);
  });

  it('GET /api/contacts rejects non-admin (403)', async () => {
    const { token } = await createUserAndToken({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'test1234',
      role: 'user',
    });

    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error || res.body.message).toBeTruthy();
  });

  it('GET /api/contacts allows admin to see contact list', async () => {
    // Seed a contact
    await Contact.create({
      firstname: 'Alice',
      lastname: 'Example',
      email: 'alice@example.com',
      message: 'Hi, I am interested in your work.',
    });

    const { token } = await createUserAndToken({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('email', 'alice@example.com');
  });
});