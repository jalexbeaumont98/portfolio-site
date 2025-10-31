import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:{ type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  },
  { timestamps: false } // using explicit created/updated fields per assignment
);

export default mongoose.model('User', userSchema);