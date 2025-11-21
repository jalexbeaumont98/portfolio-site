// api/contacts/[id].js
import { connectDB } from '../../server/db.js';
import {
  getById,
  updateById,
  removeById,
} from '../../server/controllers/contactsController.js';
import { handleAuthed } from '../_utils.js';

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  const { id } = req.query;
  req.params = req.params || {};
  req.params.id = id;

  // All ID-based operations are admin-only
  const adminWrapped = (req2, res2, next) => {
    if (req2.auth?.role !== 'admin') {
      return res2.status(403).json({ error: 'Admin only' });
    }

    if (req2.method === 'GET')    return getById(req2, res2, next);
    if (req2.method === 'PUT')    return updateById(req2, res2, next);
    if (req2.method === 'DELETE') return removeById(req2, res2, next);

    return res2.status(405).json({ error: 'Method not allowed' });
  };

  return handleAuthed(req, res, adminWrapped);
}