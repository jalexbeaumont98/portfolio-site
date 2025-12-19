// server/__tests__/test-app.js
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// server/test-app.js
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import contactsRoutes from './routes/contactsRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import qualificationsRoutes from './routes/qualificationsRoutes.js';

const app = express();

// Basic middleware needed for tests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);        // gives /api/auth/signin, /api/auth/signout
app.use("/api/users", usersRoutes); // gives /api/users/signup, /api/users/...
app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/qualifications', qualificationsRoutes);

// Generic error handler so tests see JSON instead of crashing
app.use((err, req, res, next) => {
  console.error('❌ Test Express Error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

export default app;