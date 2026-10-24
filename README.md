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

Foco → pausa curta, repetindo; a cada N focos (padrão 4), uma pausa longa. As durações de cada etapa, o intervalo da pausa longa, som/notificação ao concluir e auto-iniciar pausas são configuráveis na aba **Geral** de `/dashboard/configuracoes` (padrão: 25/5/15 min). Ao terminar um foco, o padrão é mostrar um botão único para iniciar a pausa — com "auto-iniciar pausas" ativado, a pausa começa sozinha; voltar da pausa para o foco sempre exige esse clique. Cada etapa concluída é gravada no banco (base para o histórico/heatmap/streak).

A aba **Sons** controla o alarme ao concluir uma etapa (4 opções — Sino/Suave/Clássico/Digital — com botão de prévia) e o volume, além de um ruído ambiente opcional que toca continuamente enquanto o timer está rodando: branco, rosa, ou um dos 3 temas imersivos — Chuva (ruído filtrado + pingos ocasionais), Floresta (vento suave + "piados" esparsos) e Espaço (drone grave com batimento + brilhos agudos raros). Todo o áudio é gerado na hora via Web Audio API — nenhum arquivo de áudio é carregado.

O visual do timer tem dois eixos independentes, escolhidos na aba **Aparência** (com preview de verdade): o **estilo** — 4 formatos próprios (Minimalista: anel fino; Pastel: blob respirando; Lofi: disco de vinil girando; Retro: visor LCD com barra de progresso) — e, dentro do estilo escolhido, a **cor muda sozinha conforme a fase** (foco/pausa curta/pausa longa), sem precisar trocar de estilo pra isso.

A página do timer tem um fundo ambiente (manchas de luz suaves nas cores do tema ativo) e um botão de tela cheia — usa a Fullscreen API nativa do navegador para esconder todo o resto e mostrar só o relógio sobre o fundo do tema, saindo com Esc ou o próprio botão. Também dá pra abrir o timer numa janelinha flutuante (**picture-in-picture**, nos navegadores com suporte), pra acompanhar enquanto usa outras abas.

Assim que um foco começa a rodar, o cabeçalho do dashboard (navegação, sign out) some sozinho — **modo flowstate** — e volta ao pausar, pular ou concluir a etapa; sem precisar entrar na tela cheia manualmente.

Enquanto uma sessão está em andamento, o título da aba e o favicon mostram o tempo restante e o progresso — útil pra acompanhar numa aba em segundo plano. Atalhos de teclado globais: **Espaço** inicia/pausa, **P** pula a etapa, **F** alterna tela cheia e **B** abre o **brain dump** — um bloco de notas rápido (guardado no navegador) pra anotar o que te distraiu sem sair do timer.

O histórico/heatmap/streak agrupam os ciclos pelo **fuso horário do navegador** (detectado automaticamente), não em UTC — um dia só conta como "ativo" de acordo com o relógio local de quem usou o app.

## 🌓 Modo de cor

Além do tema visual, a aba **Aparência** tem um seletor de modo de cor independente: Automático (segue o sistema operacional), Claro, Escuro e OLED (igual ao Escuro, mas com o fundo em preto puro, pensado pra telas OLED). É resolvido no servidor a partir da conta (sem flash de tela errada no carregamento) e, no modo Automático, um pequeno script decide claro/escuro pela preferência do sistema antes da primeira pintura da página.

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
│   │   ├── actions.ts     # Server Actions: recordCycle, setStyle, setColorMode, updateSettings, updateSoundSettings
│   │   ├── historico/     # Heatmap + streak + ciclos recentes
│   │   └── configuracoes/  # Abas Geral/Aparência/Sons
│   ├── login/
│   ├── register/
│   ├── layout.tsx       # Layout raiz
│   ├── page.tsx          # Landing page (front-end, pública)
│   └── globals.css
├── components/
│   ├── auth/             # Formulários e botões de login/cadastro/logout
│   ├── timer/             # PomodoroTimer, StyleFace, FullscreenToggle, PictureInPicture, ProgressRing, BrainDump
│   │   └── styles/          # Um componente por estilo (4): Minimal/Pastel/Lofi/Retro
│   ├── TimezoneSync.tsx     # Detecta o fuso horário do navegador e guarda num cookie
│   ├── history/            # Heatmap, StreakTile, RecentCyclesList
│   ├── settings/            # StylePicker, ColorModePicker + tabs/GeneralTab/SoundsTab
│   ├── ui/                   # Componentes próprios reutilizáveis: Tabs, Switch, Slider, RadioGroup, Select
│   ├── layout/                 # DashboardNav, FlowstateProvider/FlowstateHeader
│   └── landing/                 # Hero, FeatureCard, HowItWorks
├── prisma/
│   └── schema.prisma     # Modelos: User (com theme), Account, Session, Cycle...
├── lib/
│   ├── prisma.ts         # Prisma Client (singleton)
│   ├── pomodoro.ts        # Durações e máquina de estado das fases
│   ├── styles.ts           # Estilos visuais + cor por fase (fonte única da verdade)
│   ├── color-mode.ts        # Modos de cor (Automático/Claro/Escuro/OLED)
│   ├── sound.ts              # Sons de alarme e ruídos ambiente (ids e labels)
│   ├── audio-engine.ts        # Geração de áudio via Web Audio API (client-only)
│   ├── favicon.ts              # Favicon de progresso durante o timer (client-only)
│   ├── timezone.ts              # Resolve/valida o fuso horário do cookie
│   ├── heatmap.ts                # Agregação por dia (no fuso do usuário), streak
│   ├── stats.ts                  # Busca os ciclos do usuário e monta as estatísticas
│   ├── brain-dump-storage.ts      # Anotações do brain dump no localStorage
│   └── timer-storage.ts            # Persiste o timer em andamento no localStorage
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
- [x] Timer Pomodoro (foco / pausa curta / pausa longa)
- [x] Histórico de ciclos concluídos, heatmap de ciclos por dia e streak
- [x] Landing page de apresentação
- [x] Configurações do timer (durações, intervalo da pausa longa, som/notificação)
- [x] Configurações em abas (Geral/Aparência) com componentes próprios (Switch, Slider, Tabs) e auto-iniciar pausas
- [x] Modo de cor manual (Automático/Claro/Escuro/OLED), independente do estilo visual
- [x] 4 estilos visuais com formato próprio (Minimalista/Pastel/Lofi/Retro), cor que muda por fase
- [x] Aba Sons: alarme com 4 opções + prévia, volume, ruído ambiente (branco/rosa) durante o foco
- [x] Fuso horário real no histórico/heatmap/streak, título/favicon dinâmicos, atalhos de teclado, brain dump
- [x] Picture-in-picture, modo flowstate (cabeçalho some durante o foco), 3 temas sonoros imersivos (Chuva/Floresta/Espaço)
- [ ] PWA offline-first (Service Worker + IndexedDB + botão de instalar) e player de música externo (YouTube/Spotify/URL) — deliberadamente deixado pra depois

## 🌿 Fluxo de trabalho (Git Flow)

- **`main`** — produção. Só recebe merges vindos de `release/*` ou `hotfix/*`. Protegida: nenhum push direto, nem do admin.
- **`develop`** — integração. Branch padrão do repositório; para onde as features vão primeiro. Também protegida.
- **`feat/<nome>`** — uma branch por funcionalidade, criada a partir de `develop`. Ex: `feat/auth-login`.
- **`release/<versão>`** — preparação de uma versão antes de ir para `main`. Ex: `release/1.0.0`.
- **`hotfix/<nome>`** — correção urgente direto a partir de `main`, depois mesclada em `main` e `develop`.

Todo trabalho entra por Pull Request (push direto em `main`/`develop` é bloqueado pelas regras de proteção de branch no GitHub).
