import { AnswerView, AnswerData, BuyConfirmDialog, SellConfirmDialog } from '@/components/AnswerView'

interface PageParams {
  id: string
}

export default function AnswerDetailPage({ params }: { params: PageParams }) { 
  const answerId = Number(params.id)
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen pt-24 flex flex-col gap-8">
      <AnswerView id={answerId} />
      <AnswerData id={answerId} />
      <BuyConfirmDialog id={answerId} />
      <SellConfirmDialog id={answerId} />
    </main>
  )
}
