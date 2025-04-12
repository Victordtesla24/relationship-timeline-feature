import mongoose, { Schema, Document, Model } from 'mongoose';
import { hash, compare } from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'lawyer';
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: ['client', 'lawyer'],
      default: 'client',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hash(this.password, 10);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.password);
};

// Create or retrieve model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User as Model<IUser>; 