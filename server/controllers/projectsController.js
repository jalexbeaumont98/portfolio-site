import Project from '../models/Project.js';
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

// 🔓 Public: get all projects
export const getAll = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ featured: -1, created: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// 🔓 Public: get one project
export const getById = async (req, res, next) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Project not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
};


// 🔒 Admin: create project
export const createOne = async (req, res, next) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return; // response already sent

    const proj = await Project.create(req.body);
    res.status(201).json(proj);
  } catch (err) {
    next(err);
  }
};

// 🔒 Admin: update project
export const updateById = async (req, res, next) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const proj = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!proj) return res.status(404).json({ error: 'Project not found' });
    res.json(proj);
  } catch (err) {
    next(err);
  }
};


// 🔒 Admin: delete one project
export const removeById = async (req, res, next) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const proj = await Project.findByIdAndDelete(req.params.id);
    if (!proj) return res.status(404).json({ error: 'Project not found' });

    res.json({
      message: 'Project deleted',
      deleted: proj
    });
  } catch (err) {
    next(err);
  }
};

// 🔒 Admin: delete all projects (optional, but useful)
export const removeAll = async (req, res, next) => {
  try {
    const admin = await ensureAdmin(req, res);
    if (!admin) return;

    const all = await Project.find({});
    await Project.deleteMany({});
    res.json({
      message: `${all.length} projects deleted`,
      deleted: all
    });
  } catch (err) {
    next(err);
  }
};