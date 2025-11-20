// api/auth/signin.js
import { connectDB } from '../../server/db.js';
import { signin } from '../../server/controllers/authController.js';
import { handlePublic } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGO_URI not set' });
  }
  await connectDB(uri);

  // signin(req, res) already does its own try/catch,
  // but we’ll still send it through handlePublic for JSON parsing + error wrapping
  return handlePublic(req, res, signin);
}