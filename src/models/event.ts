import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
  mediaIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    mediaIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Media',
    }],
  },
  {
    timestamps: true,
  }
);

// Create or retrieve model
const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event as Model<IEvent>; 