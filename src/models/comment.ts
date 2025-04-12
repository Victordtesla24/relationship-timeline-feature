import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  content: string;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  isQuestion: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    isQuestion: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve model
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment as Model<IComment>; 