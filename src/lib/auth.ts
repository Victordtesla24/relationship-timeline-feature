import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { testUser } from './seed-data';

// Define the type for MongoDB user document
interface UserDocument {
  _id: {
    toString(): string;
  };
  name: string;
  email: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
}

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Export auth options for Next.js
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (isDevelopment && testUser) {
          // In development, we can skip the actual auth and return a test user
          console.log('Using test user for development');
          return {
            id: testUser.id || 'dev-test-id',
            name: testUser.name || 'Test User',
            email: testUser.email || 'test@example.com',
            role: 'user',
          };
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        
        // Use the UserDocument type for the database user
        const user = await User.findOne({ email: credentials.email }) as UserDocument | null;
        
        if (!user) {
          return null;
        }
        
        const isPasswordValid = await user.comparePassword(credentials.password);
        
        if (!isPasswordValid) {
          return null;
        }
        
        // Make sure _id is converted to string
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Enhance token with custom properties
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // TypeScript fix: Add custom properties to session.user
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 