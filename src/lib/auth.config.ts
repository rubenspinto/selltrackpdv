import type { NextAuthConfig } from "next-auth";

/**
 * Configuração base do NextAuth.
 * Este arquivo NÃO inicializa o NextAuth — exporta apenas o objeto de configuração.
 * É compatível com o Edge Runtime (usado pelo Middleware), pois não importa
 * módulos pesados de Node.js como Prisma ou Argon2.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
