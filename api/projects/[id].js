// api/projects/[id].js
import { connectDB } from '../../server/db.js';
import { handleController } from '../_utils.js';
import {
  getById as getProjectById,
  updateById as updateProjectById,
  removeById as removeProjectById
} from '../../server/controllers/projectsController.js';

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  // dynamic route param
  const { id } = req.query;
  req.params = req.params || {};
  req.params.id = id;

  if (req.method === 'GET') {
    // public read
    return getProjectById(req, res, err => {
      if (err) {
        console.error('Project GET by id error:', err);
        res.status(500).json({ error: 'Server error' });
      }
    });
  }

  if (req.method === 'PUT') {
    // admin-only update
    return handleController(req, res, updateProjectById);
  }

  if (req.method === 'DELETE') {
    // admin-only delete
    return handleController(req, res, removeProjectById);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}