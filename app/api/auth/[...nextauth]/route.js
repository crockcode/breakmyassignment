import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { Resend } from "resend";

// Connect to database to ensure User model is registered
connectToDatabase();

// Initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Configure email provider based on environment variables
const emailProvider = process.env.RESEND_API_KEY
  ? {
      // Use Resend API for sending emails
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        try {
          const { data, error } = await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: "Sign in to BreakMyAssignment",
            html: `<p>Please click the link below to sign in to BreakMyAssignment:</p>
                  <p><a href="${url}">Sign in</a></p>
                  <p>If you did not request this email, you can safely ignore it.</p>`,
          });
          
          if (error) {
            console.error("Error sending verification email via Resend:", error);
          }
        } catch (error) {
          console.error("Failed to send verification email via Resend:", error);
        }
      },
      from: process.env.EMAIL_FROM,
    }
  : {
      // Use SMTP settings (SendGrid or other SMTP provider)
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    };

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider(emailProvider),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      // Find the user in our own database
      const dbUser = await User.findOne({ email: user.email });
      
      // If user exists in our database, add custom properties
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.isPro = dbUser.isPro;
        session.user.uploadCount = dbUser.uploads.length;
        
        // Calculate recent uploads (past 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentUploads = dbUser.uploads.filter(upload => 
          new Date(upload.timestamp) > thirtyDaysAgo
        );
        
        session.user.recentUploadCount = recentUploads.length;
      }
      
      return session;
    },
    async signIn({ user }) {
      // When a user signs in, make sure they exist in our database
      const { email } = user;
      
      try {
        // Check if user exists
        let dbUser = await User.findOne({ email });
        
        // If not, create a new user
        if (!dbUser) {
          dbUser = new User({
            email,
            createdAt: new Date(),
            uploads: [],
            isPro: false,
          });
          await dbUser.save();
        }
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      if (url.startsWith(baseUrl)) return url;
      // If callback URL is external, redirect to dashboard as a safety measure
      else if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 