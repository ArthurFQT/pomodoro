import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "E-mail", type: "email" },
      password: { label: "Senha", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email;
      const password = credentials?.password;

      if (typeof email !== "string" || typeof password !== "string") {
        return null;
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user?.password) {
        return null;
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        return null;
      }

      return { id: user.id, name: user.name, email: user.email };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.sub) {
        return session;
      }

      // O token pode continuar válido (assinado, não expirado) mesmo
      // depois que o usuário por trás dele deixou de existir no banco
      // (conta removida em outro lugar). Sem checar isso aqui, páginas
      // como /login achariam que ainda há sessão e mandariam de volta
      // pro /dashboard, que por sua vez mandaria pro /login de novo —
      // um loop de redirecionamento.
      const userExists = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { id: true },
      });

      if (!userExists) {
        return { ...session, user: undefined } as unknown as typeof session;
      }

      if (session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});
