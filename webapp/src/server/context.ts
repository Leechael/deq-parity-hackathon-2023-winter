import { type inferAsyncReturnType } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export async function createFetchContext({ req }: FetchCreateContextFnOptions) {
  // TODO: session restore, etc. Take care that's happen on client-side.
  return { req }
}

export async function createInternalContext() {
  return {} as Context
}

type FetchContext = inferAsyncReturnType<typeof createFetchContext>

export interface Context {
  req?: FetchContext['req']
  currentUser?: {
    nickname: string
  }
}
