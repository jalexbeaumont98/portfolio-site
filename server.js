// server.js
import app from "./server/express.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Express routes (LOCAL ONLY)
import authRoutes from './server/routes/authRoutes.js';
import contactsRoutes from './server/routes/contactsRoutes.js';
import projectsRoutes from './server/routes/projectsRoutes.js';
import qualificationsRoutes from './server/routes/qualificationsRoutes.js';
import usersRoutes from './server/routes/usersRoutes.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/qualifications", qualificationsRoutes);
app.use("/api/users", usersRoutes);

// Home message
app.get("/", (req, res) => {
  res.json({ message: "Portfolio API running (LOCAL)" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Unknown error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Local server running at http://localhost:${PORT}`)
);

export default app;