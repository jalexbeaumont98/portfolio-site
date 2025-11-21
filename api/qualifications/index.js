// api/qualifications/index.js
import { connectDB } from "../../server/db.js";
import {
  listAll,
  createOne,
  ensureAdmin
} from "../../server/controllers/qualificationsController.js";
import { handlePublic, handleAuthed } from "../_utils.js";

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  if (!uri) return res.status(500).json({ error: "MONGO_URI not set" });
  await connectDB(uri);

  if (req.method === "GET") {
    return handlePublic(req, res, listAll);
  }

  if (req.method === "POST") {
    return handleAuthed(req, res, async (req2, res2, next) => {
      try {
        ensureAdmin(req2);
        return createOne(req2, res2, next);
      } catch (err) {
        return next(err);
      }
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}