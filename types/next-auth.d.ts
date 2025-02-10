// types/next-auth.d.ts
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface User extends NextAuthUser {
    role: string;
    company: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: string;
      company: string;
      name: string; // Add 'name' here
    };
  }
}
