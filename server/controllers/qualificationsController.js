import Qualification from '../models/Qualification.js';

export function ensureAdmin(req) {
  if (!req.auth || req.auth.role !== "admin") {
    const err = new Error("Admin access required");
    err.status = 403;
    throw err;
  }
}

export const listAll = async (req, res, next) => {
  try { const docs = await Qualification.find(); res.json(docs); }
  catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const doc = await Qualification.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

export const createOne = async (req, res, next) => {
  try { const doc = await Qualification.create(req.body); res.status(201).json(doc); }
  catch (err) { next(err); }
};

export const updateById = async (req, res, next) => {
  try {
    const doc = await Qualification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

export const removeById = async (req, res, next) => {
  try {
    const doc = await Qualification.findByIdAndDelete(req.params.id);
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
    const result = await Qualification.find({});
    if (result.length === 0) {
      return res.status(404).json({ message: 'No documents to delete' });
    }

    await Qualification.deleteMany({});
    res.json({
      message: `${result.length} documents deleted`,
      deleted: result
    });
  } catch (err) {
    next(err);
  }
};