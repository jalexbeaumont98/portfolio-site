// api/projects/index.js
import { connectDB } from '../../server/db.js';
import Project from '../../server/models/Project.js';
import { handleController } from '../_utils.js';
import {
  getAll as getAllProjects,
  createOne as createProject
} from '../../server/controllers/projectsController.js';

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  if (req.method === 'GET') {
    // public listing — no auth, no handleController
    return getAllProjects(req, res, err => {
      if (err) {
        console.error('Projects GET error:', err);
        res.status(500).json({ error: 'Server error' });
      }
    });
  }

  if (req.method === 'POST') {
    // admin-only create, enforced inside controller via ensureAdmin
    return handleController(req, res, createProject);
  }

  if (req.method === 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed on this endpoint' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}