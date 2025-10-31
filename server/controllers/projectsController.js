import Project from '../models/Project.js';

export const getAll = async (req, res, next) => {
  try { const docs = await Project.find(); res.json(docs); }
  catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

export const createOne = async (req, res, next) => {
  try { const doc = await Project.create(req.body); res.status(201).json(doc); }
  catch (err) { next(err); }
};

export const updateById = async (req, res, next) => {
  try {
    const doc = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
};

export const removeById = async (req, res, next) => {
  try {
    const doc = await Project.findByIdAndDelete(req.params.id);
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
    const result = await Project.find({});
    if (result.length === 0) {
      return res.status(404).json({ message: 'No documents to delete' });
    }

    await Project.deleteMany({});
    res.json({
      message: `${result.length} documents deleted`,
      deleted: result
    });
  } catch (err) {
    next(err);
  }
};