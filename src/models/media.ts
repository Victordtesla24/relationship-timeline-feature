import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  type: 'image' | 'document';
  filename: string;
  eventId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    type: {
      type: String,
      enum: ['image', 'document'],
      required: [true, 'Type is required'],
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve model
const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media as Model<IMedia>; 