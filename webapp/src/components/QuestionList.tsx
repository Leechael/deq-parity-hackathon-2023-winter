'use client';

import { trpcQuery } from '@/server/trpcProvider'

export function QuestionList() {
  const { data, isLoading } = trpcQuery.questions.lastest.useQuery({})
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {data && data.items.map(question => (
        <div key={question.id}>
          <div>{question.title}</div>
          <div>{question.body}</div>
        </div>
      ))}
    </div>
  )
}
