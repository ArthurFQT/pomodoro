<div align="center">

# 🍅 Pomodoro

**Um timer Pomodoro simples, rápido e sem distrações.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/status-em%20constru%C3%A7%C3%A3o-f97316)](#)

<br />

<img src=".github/preview.jpg" alt="Preview da página inicial do Pomodoro, em construção" width="100%" />

</div>

<br />

> 🚧 **Em construção.** Este projeto ainda está nos primeiros tijolos — a base (Next.js, estrutura de pastas, front/back) já está pronta, mas as funcionalidades do timer Pomodoro em si ainda estão sendo construídas. A página inicial reflete esse status de propósito.

## 📋 Sobre

Pomodoro é uma aplicação web para ajudar a organizar o tempo usando a técnica Pomodoro: ciclos de foco intercalados com pausas curtas. Construído com Next.js (App Router), reunindo front-end e back-end no mesmo projeto.

## 🛠️ Stack

| Camada     | Tecnologia                          |
| ---------- | ------------------------------------ |
| Framework  | [Next.js](https://nextjs.org) (App Router + Turbopack) |
| UI         | [React](https://react.dev) + [Tailwind CSS](https://tailwindcss.com) |
| Linguagem  | [TypeScript](https://www.typescriptlang.org) |
| Lint       | ESLint (`eslint-config-next`)       |

## 📁 Estrutura do projeto

```
pomodoro/
├── app/
│   ├── api/          # Back-end — Route Handlers (endpoints HTTP)
│   │   └── health/
│   ├── layout.tsx    # Layout raiz
│   ├── page.tsx       # Página inicial (front-end)
│   └── globals.css
├── components/        # Componentes de UI reutilizáveis (front-end)
├── public/            # Arquivos estáticos
└── lib/                # Lógica/utilitários compartilhados (a criar conforme necessário)
```

- **Front-end**: `app/` (páginas e layout) + `components/` (UI).
- **Back-end**: `app/api/` — cada rota é um endpoint HTTP (Route Handler).

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📜 Scripts

| Comando           | Descrição                          |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Inicia o servidor de desenvolvimento |
| `npm run build`    | Gera o build de produção            |
| `npm run start`    | Inicia o servidor em modo produção  |
| `npm run lint`     | Roda o ESLint                       |

## 🗺️ Roadmap

- [x] Estrutura inicial do projeto (front + back)
- [ ] Autenticação (login por usuário)
- [ ] Timer Pomodoro (foco / pausa curta / pausa longa) com temas
- [ ] Histórico de ciclos concluídos
- [ ] Heatmap de ciclos por dia
- [ ] Streak (sequência de dias de uso)
- [ ] Landing page de apresentação

## 🌿 Fluxo de trabalho (Git Flow)

- **`main`** — produção. Só recebe merges vindos de `release/*` ou `hotfix/*`. Protegida: nenhum push direto, nem do admin.
- **`develop`** — integração. Branch padrão do repositório; para onde as features vão primeiro. Também protegida.
- **`feat/<nome>`** — uma branch por funcionalidade, criada a partir de `develop`. Ex: `feat/auth-login`.
- **`release/<versão>`** — preparação de uma versão antes de ir para `main`. Ex: `release/1.0.0`.
- **`hotfix/<nome>`** — correção urgente direto a partir de `main`, depois mesclada em `main` e `develop`.

Todo trabalho entra por Pull Request (push direto em `main`/`develop` é bloqueado pelas regras de proteção de branch no GitHub).
