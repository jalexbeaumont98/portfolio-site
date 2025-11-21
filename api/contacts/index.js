// api/contacts/index.js
import { connectDB } from '../../server/db.js';
import {
  getAll,
  createOne,
  removeAll,
} from '../../server/controllers/contactsController.js';
import { handlePublic, handleAuthed } from '../_utils.js';

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  // Public contact form submit
  if (req.method === 'POST') {
    return handlePublic(req, res, createOne);
  }

  // Everything else → admin only
  if (req.method === 'GET') {
    return handleAuthed(req, res, (req2, res2, next) => {
      if (req2.auth?.role !== 'admin') {
        return res2.status(403).json({ error: 'Admin only' });
      }
      return getAll(req2, res2, next);
    });
  }

  if (req.method === 'DELETE') {
    return handleAuthed(req, res, (req2, res2, next) => {
      if (req2.auth?.role !== 'admin') {
        return res2.status(403).json({ error: 'Admin only' });
      }
      return removeAll(req2, res2, next);
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}