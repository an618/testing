import { apiClient } from "@/api/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_ENDPOINTS, buildApiUrl } from "@/utils/apiEndpoints";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        realm: { label: "Realm", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Make API call to your backend to validate credentials
          const url = buildApiUrl(API_ENDPOINTS.AUTH.LOGIN);
          const response = await apiClient.post(url, {
            username: credentials.username,
            password: credentials.password,
            realm: credentials.realm,
          });

          if (!response.data) return null;

          // Return user data with tokens
          return {
            id: response.data.user?.id || "1",
            email: response.data.user?.email || credentials.username,
            firstName: response.data.user?.firstName || "User",
            lastName: response.data.user?.lastName || "Name",
            role: response.data.user?.role || "employee",
            accessToken: response.data?.accessToken,
            refreshToken: response.data?.refreshToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as {
          id?: string;
          role?: string;
          firstName?: string;
          lastName?: string;
          accessToken?: string;
          refreshToken?: string;
        };
        if (typedUser.id) token.id = typedUser.id;
        if (typedUser.role) token.role = typedUser.role;
        if (typedUser.firstName) token.firstName = typedUser.firstName;
        if (typedUser.lastName) token.lastName = typedUser.lastName;
        if (typedUser.accessToken) token.accessToken = typedUser.accessToken;
        if (typedUser.refreshToken) token.refreshToken = typedUser.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
