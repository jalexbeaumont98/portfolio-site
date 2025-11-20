// api/projects/[id].js
import { connectDB } from '../../server/db.js';
import {
  getById,
  updateById,
  removeById,
} from '../../server/controllers/projectsController.js';
import { handlePublic, handleAuthed } from '../_utils.js';

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  // Grab dynamic :id from the Vercel query and map it onto Express-style params
  const { id } = req.query;
  req.params = req.params || {};
  req.params.id = id;

  if (req.method === 'GET') {
    // Public: read a single project
    return handlePublic(req, res, getById);
  }

  if (req.method === 'PUT') {
    // Admin-only update
    return handleAuthed(req, res, (req2, res2, next) => {
      if (req2.auth?.role !== 'admin') {
        return res2.status(403).json({ error: 'Admin only' });
      }
      return updateById(req2, res2, next);
    });
  }

  if (req.method === 'DELETE') {
    // Admin-only delete
    return handleAuthed(req, res, (req2, res2, next) => {
      if (req2.auth?.role !== 'admin') {
        return res2.status(403).json({ error: 'Admin only' });
      }
      return removeById(req2, res2, next);
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}