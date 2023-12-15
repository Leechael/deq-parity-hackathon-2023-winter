import { useTrpcPreload } from '@/server/appRouter'
import { RehydrateHandler } from '@/server/trpcProvider'
import { QuestionList } from '@/components/QuestionList'
import Login from "./components/Login.tsx"

export default async function Home() {
  const trpc = await useTrpcPreload()
  await trpc.questions.lastest.prefetch({})
  return (
    <RehydrateHandler data={trpc.dehydrate()}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <QuestionList />
        <Login></Login>
      </main>
    </RehydrateHandler>
  )
}
