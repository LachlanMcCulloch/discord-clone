import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const appRouter = t.router({
  health: t.procedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'SST + tRPC is working!',
    }
  }),
})

export type AppRouter = typeof appRouter
