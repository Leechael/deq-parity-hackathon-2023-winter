import { useTrpcPreload } from '@/server/appRouter'
import { RehydrateHandler } from '@/server/trpcProvider'
import { FooComp } from './comp'

export default async function Home() {
  const trpc = await useTrpcPreload()
  await trpc.ciao.prefetch()
  return (
    <RehydrateHandler data={trpc.dehydrate()}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <FooComp />
      </main>
    </RehydrateHandler>
  )
}
