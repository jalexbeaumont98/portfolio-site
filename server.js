//import express from "express";
//var express = require("express");
//var app = express();
import app from "./server/express.js";
import router from "./server/assets-router.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';



// Routes
import authRoutes from './server/routes/authRoutes.js';
import contactsRoutes from './server/routes/contactsRoutes.js';
import projectsRoutes from './server/routes/projectsRoutes.js';
import qualificationsRoutes from './server/routes/qualificationsRoutes.js';
import usersRoutes from './server/routes/usersRoutes.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/qualifications', qualificationsRoutes);
app.use('/api/users', usersRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the same folder as server.js
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log('Connected to MongoDB');
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Host: ${conn.connection.host}`);
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));





app.get('/', (req, res) => {
  res.json({ message: "Welcome to my Portfolio Application" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Unknown error' });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
//module.exports = app;
export default app;
