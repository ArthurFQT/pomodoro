<div align="center">

# 🍅 Pomodoro

**Um timer Pomodoro simples, rápido e sem distrações.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/status-ativo-16a34a)](#)

<br />

<img src=".github/preview.jpg" alt="Preview da landing page do Pomodoro" width="100%" />

</div>

<br />

## 📋 Sobre

Pomodoro é uma aplicação web para ajudar a organizar o tempo usando a técnica Pomodoro: ciclos de foco intercalados com pausas curtas. Construído com Next.js (App Router), reunindo front-end e back-end no mesmo projeto.

## ⏱️ Como funciona o timer

Foco de 25 minutos → pausa curta de 5 minutos, repetindo; a cada 4 focos, uma pausa longa de 15 minutos. Ao terminar uma etapa, toca um aviso sonoro/notificação e mostra um botão único para iniciar a próxima — nunca avança sozinho sem interação. Cada etapa concluída é gravada no banco (base para o histórico/heatmap/streak futuros). O tema visual (5 opções) é salvo na conta e sincroniza entre dispositivos.

## 🛠️ Stack

| Camada     | Tecnologia                          |
| ---------- | ------------------------------------ |
| Framework  | [Next.js](https://nextjs.org) (App Router + Turbopack) |
| UI         | [React](https://react.dev) + [Tailwind CSS](https://tailwindcss.com) |
| Linguagem  | [TypeScript](https://www.typescriptlang.org) |
| Autenticação | [Auth.js / NextAuth v5](https://authjs.dev) (Google, GitHub, e-mail/senha) |
| Banco de dados | [Postgres (Neon)](https://neon.tech) + [Prisma](https://www.prisma.io) |
| Lint       | ESLint (`eslint-config-next`)       |

## 📁 Estrutura do projeto

```
pomodoro/
├── app/
│   ├── api/            # Back-end — Route Handlers (endpoints HTTP)
│   │   ├── auth/        # Auth.js (login/callback/signout)
│   │   ├── health/
│   │   └── register/    # Cadastro (e-mail/senha)
│   ├── dashboard/        # Área autenticada (protegida pelo proxy.ts)
│   │   ├── layout.tsx    # Shell logado: cabeçalho, nav, tema do usuário, sign out
│   │   ├── page.tsx       # O timer Pomodoro
│   │   ├── actions.ts     # Server Actions: recordCycle, setTheme
│   │   └── historico/     # Heatmap + streak + ciclos recentes
│   ├── login/
│   ├── register/
│   ├── layout.tsx       # Layout raiz
│   ├── page.tsx          # Landing page (front-end, pública)
│   └── globals.css
├── components/
│   ├── auth/             # Formulários e botões de login/cadastro/logout
│   ├── timer/             # PomodoroTimer, ProgressRing, ThemeSwitcher
│   ├── history/            # Heatmap, StreakTile, RecentCyclesList
│   ├── layout/              # DashboardNav
│   └── landing/              # Hero, FeatureCard, HowItWorks
├── prisma/
│   └── schema.prisma     # Modelos: User (com theme), Account, Session, Cycle...
├── lib/
│   ├── prisma.ts         # Prisma Client (singleton)
│   ├── pomodoro.ts        # Durações e máquina de estado das fases
│   ├── themes.ts           # Lista de temas visuais (fonte única da verdade)
│   ├── heatmap.ts           # Agregação por dia, níveis de intensidade, streak
│   ├── stats.ts              # Busca os ciclos do usuário e monta as estatísticas
│   └── timer-storage.ts       # Persiste o timer em andamento no localStorage
├── auth.ts                # Config completa do Auth.js (providers, Prisma adapter)
├── auth.config.ts         # Config "leve" usada pelo proxy.ts (protege rotas)
├── proxy.ts                # Protege /dashboard (substitui middleware.ts no Next 16)
└── public/                 # Arquivos estáticos
```

- **Front-end**: `app/` (páginas e layout) + `components/` (UI).
- **Back-end**: `app/api/` — cada rota é um endpoint HTTP (Route Handler).

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🔑 Configuração do ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Onde conseguir |
| --- | --- |
| `DATABASE_URL` | Crie um projeto em [neon.tech](https://neon.tech) (free tier) e copie a connection string |
| `AUTH_SECRET` | Gere com `npx auth secret` (ou `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Crie um OAuth Client em [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) — redirect URI: `http://localhost:3000/api/auth/callback/google` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Crie um OAuth App em [github.com/settings/developers](https://github.com/settings/developers) — callback URL: `http://localhost:3000/api/auth/callback/github` |

O app builda e roda sem o Google/GitHub configurados (esses botões de login só aparecem quando as variáveis existem), mas **`DATABASE_URL` é necessária** para qualquer login funcionar (inclusive cadastro por e-mail/senha). Depois de configurar, crie as tabelas com:

```bash
npm run db:push
```

## 📜 Scripts

| Comando             | Descrição                            |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Inicia o servidor de desenvolvimento  |
| `npm run build`      | Gera o build de produção              |
| `npm run start`      | Inicia o servidor em modo produção    |
| `npm run lint`       | Roda o ESLint                         |
| `npm run db:push`    | Sincroniza o schema Prisma com o banco |
| `npm run db:migrate` | Cria uma migration Prisma             |
| `npm run db:studio`  | Abre o Prisma Studio (GUI do banco)   |

## 🗺️ Roadmap

- [x] Estrutura inicial do projeto (front + back)
- [x] Fundação de autenticação + banco de dados (Auth.js + Prisma + Neon)
- [x] Timer Pomodoro (foco / pausa curta / pausa longa) com 5 temas visuais
- [x] Histórico de ciclos concluídos, heatmap de ciclos por dia e streak
- [x] Landing page de apresentação

## 🌿 Fluxo de trabalho (Git Flow)

- **`main`** — produção. Só recebe merges vindos de `release/*` ou `hotfix/*`. Protegida: nenhum push direto, nem do admin.
- **`develop`** — integração. Branch padrão do repositório; para onde as features vão primeiro. Também protegida.
- **`feat/<nome>`** — uma branch por funcionalidade, criada a partir de `develop`. Ex: `feat/auth-login`.
- **`release/<versão>`** — preparação de uma versão antes de ir para `main`. Ex: `release/1.0.0`.
- **`hotfix/<nome>`** — correção urgente direto a partir de `main`, depois mesclada em `main` e `develop`.

Todo trabalho entra por Pull Request (push direto em `main`/`develop` é bloqueado pelas regras de proteção de branch no GitHub).
