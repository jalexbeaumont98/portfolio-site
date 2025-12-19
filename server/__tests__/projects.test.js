// server/__tests__/projects.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../test-app.js';           // same helper you used in auth.test.js
import User from '../models/User.js';
import Project from '../models/Project.js';
import { connectDB } from "../db.js";
import { jest } from '@jest/globals';

// 🔧 Increase Jest timeout because remote DB + first connect can be slow
jest.setTimeout(30000); // 30s for this file

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  if (!uri) throw new Error("No test Mongo URI set");

  await connectDB(uri);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
});

afterAll(async () => {
  // Close Mongoose so Jest can exit cleanly
  await mongoose.connection.close();
});

async function createUserAndToken({ name, email, password, role = 'user' }) {
  // Create user directly via Mongoose
  const user = await User.create({ name, email, password, role });

  // Sign in to get JWT
  const res = await request(app)
    .post('/api/auth/signin')
    .send({ email, password })
    .expect(200);

  return { user, token: res.body.token };
}

describe('Projects API', () => {
  it('GET /api/projects returns an array publicly', async () => {
    await Project.create({
      title: 'Test Project',
      tagline: 'Short description',
      description: 'Longer body text',
      links: [],
      imageUrls: [],
      techStack: ['React', 'Node'],
      role: 'Solo dev',
      featured: true,
    });

    const res = await request(app).get('/api/projects').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('title', 'Test Project');
  });

  it('POST /api/projects rejects non-admin user (403)', async () => {
    const { token } = await createUserAndToken({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'test1234',
      role: 'user', // non-admin
    });

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Should Not Work',
        tagline: 'Blocked',
        description: 'This should not be created',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error || res.body.message).toBeTruthy();

    const count = await Project.countDocuments({});
    expect(count).toBe(0);
  });

  it('POST /api/projects allows admin to create project (201)', async () => {
    const { token } = await createUserAndToken({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const payload = {
      title: 'Portfolio Project',
      tagline: 'A polished portfolio piece',
      description: 'Full-stack portfolio app with React, Node, MongoDB.',
      techStack: ['React', 'Node', 'MongoDB'],
      featured: true,
      imageUrls: ['https://example.com/image1.png'],
      links: [
        { label: 'GitHub', url: 'https://github.com/example/repo', type: 'github' },
      ],
    };

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title', payload.title);
    expect(res.body).toHaveProperty('tagline', payload.tagline);

    const inDb = await Project.findOne({ title: 'Portfolio Project' });
    expect(inDb).not.toBeNull();
    expect(inDb.featured).toBe(true);
  });

  it('PUT /api/projects/:id lets admin update an existing project', async () => {
    const { token } = await createUserAndToken({
      name: 'Admin User',
      email: 'admin2@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const project = await Project.create({
      title: 'Old Title',
      tagline: 'Old tagline',
      description: 'Old description',
    });

    const res = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Title',
        tagline: 'Updated tagline',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'New Title');
    expect(res.body).toHaveProperty('tagline', 'Updated tagline');

    const reloaded = await Project.findById(project._id);
    expect(reloaded.title).toBe('New Title');
  });
});