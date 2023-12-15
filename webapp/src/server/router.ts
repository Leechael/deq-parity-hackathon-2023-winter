import { initTRPC, TRPCError } from '@trpc/server'

import { type Context } from './context'

//
// Create the tRPC instance.
//
export const t = initTRPC.context<Context>().create()

//
// Predefined procedures, includes:
// - publicProcedure: no authentication required
//
export const publicProcedure = t.procedure

//
// authentication middleware.
//
type AuthedContext = Omit<Context, 'currentUser'> & Required<Pick<Context, 'currentUser'>>


type MiddlewareArgs = Parameters<Parameters<typeof t.middleware>[0]>[0]

function getCurrentUserIdOrThrows() {
  // TODO
}

function auth_middleware({ ctx, next }: MiddlewareArgs) {
  // const { current_user_id, role } = getCurrentUserIdOrThrows(ctx, allows)
  const currentUser = {
    nickname: 'Jack'
  }
  return next({
    ctx: { ...ctx, currentUser } as AuthedContext,
  })
}


export const protectedProcedure = t.procedure.use(t.middleware(auth_middleware))

export const router = t.router
