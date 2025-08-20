// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import axios from "axios";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken: string;
}

interface GoogleCallbackResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
    accessToken?: string;
    refreshToken?: string;
  }
}


const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
       
        try {
          const response = await axios.post<UserResponse>(`http://localhost:8000/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
         
          const user = response.data;
         
          if (response.status === 200 && user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.profilePicture,
            };
          }
         
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.sub = user.id;
        
        if (account.provider === "google") {
          try {
            // Send Google user data to our backend for processing
            const googleUser = {
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              googleId: account.providerAccountId,
              profilePicture: user.image,
            };

            const response = await axios.post<GoogleCallbackResponse>(
              `${process.env.BACKEND_URL || 'http://localhost:8000'}/auth/google/login`, 
              googleUser
            );
           
            const data = response.data;
           
            if (response.status === 200) {
              token.role = data.role;
              token.accessToken = data.accessToken;
              token.refreshToken = data.refreshToken;
            }
          } catch (error) {
            console.error("Google verification error:", error);
          }
        } else {
          token.role = user.role;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }
      }
     
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = (token.role as string) || 'CLIENT';
      }
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };