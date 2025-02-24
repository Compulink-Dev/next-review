import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/database";
import { Session, User } from "next-auth";
import UserModel from "@/lib/models/User";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials) return null;

        console.log("📩 Attempting login with:", credentials.email);

        const user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          console.log("❌ User not found");
          return null;
        }

        if (user.role === "employee" && user.status === "inactive") {
          throw new Error(
            "Your account is inactive. Please contact your company administrator."
          );
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) {
          console.log("🔑 Password mismatch");
          return null;
        }

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user._id.toString(),
              email: user.email,
              role: user.role,
              company: user.company || null,
              name: user.name, // Ensure 'name' is included here
            };
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages: {
    signIn: "/signin",
    newUser: "/register",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.company = user.company;
        token.name = user.name || ""; // Ensure 'name' is passed in the token
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.company = token.company;
        session.user.name = token.name || ""; // Ensure 'name' is available in the session
      }
      return session;
    },
  },
};
