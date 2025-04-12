import mongoose, { Schema, Document, Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import crypto from 'crypto';

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

// Fallback SHA-256 hash function for environments where bcrypt fails
async function sha256Hash(password: string): Promise<string> {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHash('sha256')
      .update(password + salt)
      .digest('hex');
    return `sha256:${salt}:${hash}`;
  } catch (error: any) {
    console.error('Error in SHA-256 hashing:', error);
    // If even SHA-256 fails, store a marker that we need to reset password
    return 'reset_required:' + Date.now();
  }
}

// Compare password with SHA-256 hash
async function compareSha256(candidatePassword: string, storedHash: string): Promise<boolean> {
  try {
    const [method, salt, hash] = storedHash.split(':');
    if (method !== 'sha256') return false;
    
    const candidateHash = crypto
      .createHash('sha256')
      .update(candidatePassword + salt)
      .digest('hex');
    
    return hash === candidateHash;
  } catch (error: any) {
    console.error('Error in SHA-256 comparison:', error);
    return false;
  }
}

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Skip hashing if password hasn't changed
  if (!this.isModified('password')) return next();

  try {
    console.log('Hashing password for user:', this.email);

    // Determine if we're in a Vercel serverless environment
    const isServerless = process.env.VERCEL === '1';
    
    if (isServerless) {
      // In Vercel serverless, prefer SHA-256 for faster performance and reliability
      this.password = await sha256Hash(this.password);
      console.log('Using SHA-256 in serverless environment');
    } else {
      // In other environments, try bcrypt first with fallback
      try {
        this.password = await hash(this.password, 10);
        console.log('Password hashed with bcrypt');
      } catch (bcryptError) {
        console.warn('Bcrypt failed, using SHA-256 fallback:', bcryptError.message);
        this.password = await sha256Hash(this.password);
      }
    }
    
    console.log('Password hashed successfully');
    next();
  } catch (error: any) {
    console.error('Error hashing password:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    console.log('Comparing password for user:', this.email);
    
    // Handle reset required case
    if (this.password.startsWith('reset_required:')) {
      console.warn('User needs to reset password');
      return false;
    }
    
    // Check if we need to use SHA-256 comparison
    if (this.password.startsWith('sha256:')) {
      return compareSha256(candidatePassword, this.password);
    }
    
    // Otherwise use bcrypt
    try {
      const isMatch = await compare(candidatePassword, this.password);
      console.log('Password match result (bcrypt):', isMatch);
      return isMatch;
    } catch (bcryptError) {
      console.error('Error in bcrypt comparison:', bcryptError);
      return false;
    }
  } catch (error: any) {
    console.error('Error comparing password:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    return false;
  }
};

// Create or retrieve model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User as Model<IUser>; 