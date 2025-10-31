import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      firstName?: string;
      lastName?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    role?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
