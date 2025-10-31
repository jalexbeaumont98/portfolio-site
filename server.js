//import express from "express";
//var express = require("express");
//var app = express();
import app from "./server/express.js";
import router from "./server/assets-router.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the same folder as server.js
dotenv.config({ path: path.join(__dirname, '.env') });

// Mongo connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
import contactsRoutes from './server/routes/contactsRoutes.js';
import projectsRoutes from './server/routes/projectsRoutes.js';
import qualificationsRoutes from './server/routes/qualificationsRoutes.js';
import usersRoutes from './server/routes/usersRoutes.js';

app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/qualifications', qualificationsRoutes);
app.use('/api/users', usersRoutes);

// Basic health check
app.get('/', (req, res) => res.send('Server is running'));

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Unknown error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
//module.exports = app;
export default app;
