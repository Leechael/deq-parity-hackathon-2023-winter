import { QuestionCreateForm } from '@/components/QuestionCreateForm'

export default async function QuestionCreatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
      <QuestionCreateForm />
    </main>
  )
}
