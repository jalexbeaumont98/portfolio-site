import Qualification from '../models/Qualification.js';

export const getAll = async (req, res, next) => {
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
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

export const removeAll = async (req, res, next) => {
  try { const resu = await Qualification.deleteMany({}); res.json({ deleted: resu.deletedCount }); }
  catch (err) { next(err); }
};