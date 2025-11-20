// server/express.js
import express from 'express';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

// Optional: if you still need this for serving static assets locally
import router from './assets-router.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import contactsRoutes from './routes/contactsRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import qualificationsRoutes from './routes/qualificationsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Optional asset router (if you use it)
app.use(router);

// API routes 
app.use('/api/auth', authRoutes);            // POST /api/auth/signin, /signup, etc.
app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/qualifications', qualificationsRoutes);
app.use('/api/users', usersRoutes);

// Simple health / welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Portfolio Application' });
});

// Error handler (Express-style)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Unknown error' });
});

export default app;