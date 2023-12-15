import { z } from 'zod'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { publicProcedure, router } from './router'
import { createInternalContext } from './context'

export const appRouter = router({
  ciao: publicProcedure
    .input(z.void())
    .output(z.object({
      succeed: z.boolean(),
      data: z.any(),
    }))
    .query(async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto', {
        cache: 'no-cache',
      })
      const data = await response.json()
      return { succeed: true, data }
    })
})

export type AppRouter = typeof appRouter

export async function useTrpcPreload() {
  const ctx = await createInternalContext()
  return createServerSideHelpers({
    router: appRouter,
    ctx,
  })
}
