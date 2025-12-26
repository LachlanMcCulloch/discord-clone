## 📁 Example Repo Structure

```bash
discord-clone/
├── package.json                      # Root package.json (workspaces config)
├── pnpm-workspace.yaml              # pnpm workspace definition
├── tsconfig.json                    # Base TypeScript config
├── .gitignore
├── .env.example
├── README.md
│
├── sst.config.ts                    # SST infrastructure definition
├── sst-env.d.ts                     # SST environment types (auto-generated)
│
├── docker-compose.yml               # Local DynamoDB + Admin UI
│── packages/
│   │
│   ├── core/                        # Shared business logic & types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── src/
│   │       ├── index.ts             # Main export
│   │       │
│   │       ├── db/                  # Database utilities
│   │       │   ├── client.ts        # DynamoDB client
│   │       │   ├── entities.ts      # Entity helpers (build PK/SK)
│   │       │   └── index.ts
│   │       │
│   │       ├── trpc/                # tRPC setup
│   │       │   ├── context.ts       # tRPC context (user, db client)
│   │       │   ├── router.ts        # Root router
│   │       │   ├── middleware.ts    # Auth middleware
│   │       │   │
│   │       │   └── routers/         # Feature routers
│   │       │       ├── auth.ts      # auth.signup, auth.login
│   │       │       ├── servers.ts   # servers.create, servers.list
│   │       │       ├── channels.ts  # channels.create, channels.list
│   │       │       ├── messages.ts  # messages.send, messages.list
│   │       │       └── users.ts     # users.me, users.updateProfile
│   │       │
│   │       ├── services/            # Business logic (pure functions)
│   │       │   ├── auth.service.ts
│   │       │   ├── server.service.ts
│   │       │   ├── channel.service.ts
│   │       │   ├── message.service.ts
│   │       │   └── user.service.ts
│   │       │
│   │       ├── types/               # Shared TypeScript types
│   │       │   ├── user.ts
│   │       │   ├── server.ts
│   │       │   ├── channel.ts
│   │       │   ├── message.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── schemas/             # Zod validation schemas
│   │       │   ├── auth.schema.ts
│   │       │   ├── server.schema.ts
│   │       │   ├── channel.schema.ts
│   │       │   ├── message.schema.ts
│   │       │   └── index.ts
│   │       │
│   │       └── utils/               # Utility functions
│   │           ├── crypto.ts        # Password hashing, JWT
│   │           ├── id.ts            # ID generation (ulid/uuid)
│   │           └── date.ts          # Date helpers
│   │
│   ├── functions/                   # Lambda function handlers
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── trpc.ts              # Main tRPC Lambda handler
│   │       │
│   │       └── ws/                  # WebSocket handlers
│   │           ├── connect.ts       # $connect
│   │           ├── disconnect.ts    # $disconnect
│   │           ├── default.ts       # $default
│   │           └── sendMessage.ts   # sendMessage route
│   │
│   └── frontend/                    # React application
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── index.html
│       │
│       ├── public/                  # Static assets
│       │   └── favicon.ico
│       │
│       ├── src/
│       │   ├── main.tsx             # App entry point
│       │   ├── App.tsx              # Root component
│       │   ├── index.css            # Tailwind imports
│       │   │
│       │   ├── lib/                 # Core utilities
│       │   │   ├── trpc.ts          # tRPC React client setup
│       │   │   ├── ws.ts            # WebSocket client
│       │   │   └── utils.ts         # Helper functions (cn, etc.)
│       │   │
│       │   ├── store/               # Zustand stores
│       │   │   ├── auth.store.ts    # Auth state
│       │   │   ├── ui.store.ts      # UI state (selected server/channel)
│       │   │   └── ws.store.ts      # WebSocket connection state
│       │   │
│       │   ├── routes/              # Route components
│       │   │   ├── index.tsx        # Route definitions (React Router)
│       │   │   ├── auth/
│       │   │   │   ├── login.tsx
│       │   │   │   └── signup.tsx
│       │   │   ├── app/             # Main app (protected)
│       │   │   │   ├── layout.tsx   # App shell (sidebar + main)
│       │   │   │   └── channel.tsx  # Channel view
│       │   │   └── invite/
│       │   │       └── [code].tsx   # Join via invite
│       │   │
│       │   ├── components/          # React components
│       │   │   ├── ui/              # Reusable UI components (shadcn/ui style)
│       │   │   │   ├── button.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── avatar.tsx
│       │   │   │   └── ...
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   ├── LoginForm.tsx
│       │   │   │   ├── SignupForm.tsx
│       │   │   │   └── ProtectedRoute.tsx
│       │   │   │
│       │   │   ├── servers/
│       │   │   │   ├── ServerSidebar.tsx
│       │   │   │   ├── ServerIcon.tsx
│       │   │   │   └── CreateServerModal.tsx
│       │   │   │
│       │   │   ├── channels/
│       │   │   │   ├── ChannelList.tsx
│       │   │   │   ├── ChannelItem.tsx
│       │   │   │   └── CreateChannelModal.tsx
│       │   │   │
│       │   │   └── messages/
│       │   │       ├── MessageList.tsx
│       │   │       ├── MessageItem.tsx
│       │   │       ├── MessageInput.tsx
│       │   │       └── TypingIndicator.tsx
│       │   │
│       │   └── hooks/               # Custom React hooks
│       │       ├── useAuth.ts
│       │       ├── useWebSocket.ts
│       │       └── useTypingIndicator.ts
│       │
│       └── e2e/                     # E2E tests
│           ├── playwright.config.ts
│           └── tests/
│               ├── auth.spec.ts
│               ├── messaging.spec.ts
│               └── servers.spec.ts
│
└── infra/                           # SST infrastructure stacks (optional)
    └── stacks/
        ├── api.ts                   # API Gateway + Lambda
        ├── database.ts              # DynamoDB table
        ├── storage.ts               # S3 bucket
        └── websocket.ts             # WebSocket API
```
