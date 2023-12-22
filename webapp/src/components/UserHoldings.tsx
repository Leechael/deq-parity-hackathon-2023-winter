'use client';

import { Spinner } from '@material-tailwind/react'

import { trpcQuery } from '@/server/trpcProvider'
import { AnswerCard } from '@/components/AnswerCard'

export function UserHoldings({ handle }: { handle: string }) {
  const { data, isLoading } = trpcQuery.users.holdings.useQuery({ handle })
  return (
    <div>
      {isLoading ? (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2.5">
        {data && data.items.map(({ answer }) => {
          return (
            <AnswerCard answer={answer} key={answer.id} />
          )
        })}
        {
          !isLoading && data && data.items.length === 0 ? (
            <div className="text-center text-gray-600 py-4">Empty</div>
          ) : null
        }
      </div>
    </div>
  )
}
