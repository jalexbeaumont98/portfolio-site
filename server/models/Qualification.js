import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    institution:       { type: String, required: true, trim: true },
    location:       { type: String, required: true, trim: true },
    startDate:  { type: Date,   required: true },
    endDate:  { type: Date,   required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Qualification', qualificationSchema);