import Contact from '../models/Contact.js';
import User from '../models/User.js';
import mongoose from 'mongoose';


// Helper: ensure current user is admin
async function ensureAdmin(req, res) {
  const userId = req.auth && req.auth._id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({ error: 'Invalid user id in token' });
    return null;
  }

  const user = await User.findById(userId).select('role email name');
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin only' });
    return null;
  }

  return user;
}

export const getAll = async (req, res, next) => {
  try { 
    
    const admin = await ensureAdmin(req, res);
    if (!admin) return; // response already sent

    const docs = await Contact.find(); res.json(docs); }
  catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return; // response already sent

    const doc = await Contact.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

export const createOne = async (req, res, next) => {
  try { const doc = await Contact.create(req.body); res.status(201).json(doc); }
  catch (err) { next(err); }
};

export const updateById = async (req, res, next) => {
  try {

    const admin = await ensureAdmin(req, res);
    if (!admin) return; // response already sent

    const doc = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

export const removeById = async (req, res, next) => {
  try {

    const admin = await ensureAdmin(req, res);
    if (!admin) return; // response already sent

    const doc = await Contact.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({
      message: 'Document successfully deleted',
      deleted: doc
    });
  } catch (err) {
    next(err);
  }
};

export const removeAll = async (req, res, next) => {
  try {

    const admin = await ensureAdmin(req, res);
    if (!admin) return; // response already sent

    const result = await Contact.find({});
    if (result.length === 0) {
      return res.status(404).json({ message: 'No documents to delete' });
    }

    await Contact.deleteMany({});
    res.json({
      message: `${result.length} documents deleted`,
      deleted: result
    });
  } catch (err) {
    next(err);
  }
};