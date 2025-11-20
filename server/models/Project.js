// server/models/Project.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Reusable subdocument for links
const linkSchema = new Schema({
  label: { type: String, trim: true }, // e.g. "GitHub", "itch.io", "App Store"
  url:   { type: String, required: true, trim: true },
  type:  {
    type: String,
    enum: ['github', 'itch', 'store', 'video', 'docs', 'other'],
    default: 'other'
  }
}, { _id: false });

const projectSchema = new Schema({
  // Existing assignment fields (keep these so you don’t break marking)
  title:       { type: String, required: true, trim: true },
  email:       { type: String, trim: true },
  completed:  { type: Boolean, default: false },
  completionDate:  { type: Date },
  description: { type: String, trim: true },

  // ⭐ New portfolio-friendly fields

  // Generic list of links (GitHub, itch, store page, design doc, etc.)
  links: [linkSchema],

  // Special “hero” video link for embedding on the project page
  videoUrl: { type: String, trim: true },

  // Easiest way to do images: store URLs, not binary blobs
  // (e.g. images hosted on Vercel /public, Cloudinary, itch, etc.)
  imageUrls: [{ type: String, trim: true }],

  // Optional extra polish fields
  techStack: [{ type: String, trim: true }],   // ["Unity", "C#", "Firebase"]
  role:      { type: String, trim: true },     // "Solo dev", "Programmer", etc.
  featured:  { type: Boolean, default: false },

  created:   { type: Date, default: Date.now },
  updated:   { type: Date, default: Date.now }
});

// Keep updated timestamp fresh on save
projectSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

export default mongoose.model('Project', projectSchema);