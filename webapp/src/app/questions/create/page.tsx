import { QuestionCreateForm } from '@/components/QuestionCreateForm'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QuestionCreateForm />
    </main>
  )
}
