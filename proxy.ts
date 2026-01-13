// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const proxy = async () => {
  NextAuth(authConfig);
};
