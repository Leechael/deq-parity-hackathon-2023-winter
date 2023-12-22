'use client';

import { Spinner } from '@material-tailwind/react'

import { trpcQuery } from '@/server/trpcProvider'
import { QuestionCard } from '@/components/QuestionCard'

export function UserRewards({ handle }: { handle: string }) {
  const { data, isLoading } = trpcQuery.users.rewards.useQuery({ handle })
  return (
    <div>
      {isLoading ? (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2.5">
        {data && data.items.map((question) => (
          <QuestionCard question={question} key={question.id} />
        ))}
        {
          !isLoading && data && data.items.length === 0 ? (
            <div className="text-center text-gray-600 py-4">Empty</div>
          ) : null
        }
      </div>
    </div>
  )
}
