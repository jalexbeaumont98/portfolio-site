// api/projects/index.js
// api/projects/index.js
import { connectDB } from '../../server/db.js';
import {
  getAll,
  createOne,
} from '../../server/controllers/projectsController.js';
import { handlePublic, handleAuthed } from '../_utils.js';

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  if (req.method === 'GET') {
    // Public: list all projects
    return handlePublic(req, res, getAll);
  }

  if (req.method === 'POST') {
    // Admin-only create
    return handleAuthed(req, res, (req2, res2, next) => {
      if (req2.auth?.role !== 'admin') {
        return res2.status(403).json({ error: 'Admin only' });
      }
      return createOne(req2, res2, next);
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}