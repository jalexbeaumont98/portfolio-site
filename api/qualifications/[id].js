// api/qualifications/[id].js
import { connectDB } from "../../server/db.js";
import {
  getById,
  updateById,
  removeById,
  ensureAdmin
} from "../../server/controllers/qualificationsController.js";
import { handlePublic, handleAuthed } from "../_utils.js";

export default async function handler(req, res) {

  const uri = process.env.MONGO_URI;
  if (!uri) return res.status(500).json({ error: "MONGO_URI not set" });
  await connectDB(uri);

  const { id } = req.query;
  req.params = req.params || {};
  req.params.id = id;

  if (req.method === "GET") {
    return handlePublic(req, res, getById);
  }

  if (req.method === "PUT") {
    return handleAuthed(req, res, async (req2, res2, next) => {
      try {
        ensureAdmin(req2);
        return updateById(req2, res2, next);
      } catch (err) {
        return next(err);
      }
    });
  }

  if (req.method === "DELETE") {
    return handleAuthed(req, res, async (req2, res2, next) => {
      try {
        ensureAdmin(req2);
        return removeById(req2, res2, next);
      } catch (err) {
        return next(err);
      }
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}