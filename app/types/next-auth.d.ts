import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      role?: string;
      accessToken?: string;
      name?: string;
      lastName?: string;
      urlImg?: string | null;
      error?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    name: string;
    lastName: string;
    urlImg: string | null;
    accessToken: string;
    error?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    name: string;
    lastName: string;
    urlImg: string | null;
    accessToken: string;
    error?: string | null;
  }
}
