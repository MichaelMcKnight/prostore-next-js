import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

// IMPORTANT: no prisma imports in this file

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // NOTE: Edge middleware should not hit DB.
        // This authorize function is for the Node runtime auth handler/sign-in flow.
        // We'll override it in auth.ts (server-only) where prisma exists.
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user, trigger }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        if (user.name === "NO_NAME") {
          // just set token name here; DB update must happen server-side
          token.name = user.email?.split("@")[0];
        }
      }
      return token;
    },

    authorized({ request, auth }: any) {
      // Array of regex patterns to protect routes
      const protectedRoutes = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from req URL object
      const { pathname } = request.nextUrl;

      // Check if the requested path matches any protected route
      if (!auth && protectedRoutes.some((pattern) => pattern.test(pathname))) {
        return false;
      }

      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();

        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set new sessionCartId in response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
