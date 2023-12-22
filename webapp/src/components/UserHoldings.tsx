'use client';

import Link from 'next/link'
import { Spinner, Avatar, Card, CardBody, Typography, ButtonGroup, Button } from '@material-tailwind/react'
import { formatEther } from 'viem'
import { useSetAtom } from 'jotai'

import { trpcQuery } from '@/server/trpcProvider'
import { MarkdownView } from '@/components/MarkdownView'
import { QuestionCreateForm } from '@/components/QuestionCreateForm'
import cn from '@/utils/cn'
import { formatRelativeTime } from '@/utils/datetime'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms'

export function Holdings({ userId }: { userId: number }) {
  const { data, isLoading } = trpcQuery.users.holdings.useQuery({
    userId
  })
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  return (
    <>
      <div className="flex flex-row gap-4">
        <Card className="grow">
          <CardBody>
          {data?.user ? (
            <div className="flex flex-row gap-2 items-center">
              <Link href={`/u/${data.user.handle}`}>
                <Avatar
                  src={data.user.avatar}
                  alt="avatar"
                  className="border border-gray-400 p-0.5"
                />
              </Link>
              <div>
                <Typography className="font-medium text-3xl">
                  <Link href={`/u/${data.user.handle}`}>
                    @{data.user.name}
                  </Link>
                </Typography>
              </div>
            </div>
          ) : null}
          </CardBody>
        </Card>
        <QuestionCreateForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold ml-1">Holdings</h2>
        {isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-2.5">
          {data && data.items.map(({ answer }) => {
            return (
              <Card
                key={answer.id}
                shadow={false}
                className={cn("w-full rounded-3xl p-8 pt-4")}
              >
                <CardBody className="flex flex-col gap-4">
                  <header className="pb-2.5 border-b border-gray-300">
                    <div className="flex flex-row gap-2 items-center">
                      <Link href={`/u/${answer.user.handle}`}>
                        <Avatar
                          src={answer.user.avatar}
                          alt="avatar"
                          className="border border-gray-400 p-0.5"
                        />
                      </Link>
                      <div>
                        <Typography className="font-medium">
                          <Link href={`/u/${answer.user.handle}`}>
                            @{answer.user.name}
                          </Link>
                        </Typography>
                        <Link href={`/answers/${answer.id}`}>
                          <Typography className="text-xs text-gray-700 hover:underline">
                            {formatRelativeTime(answer.createdAt)}
                          </Typography>
                        </Link>
                      </div>
                    </div>
                  </header>
                  <MarkdownView>
                    {answer.body}
                  </MarkdownView>
                  <div className="flex justify-between items-center mt-2 border-t border-gray-300 pt-2">
                    <div className="flex flex-col">
                      <Typography variant="h3">
                        {formatEther(answer.pricePerShare)}
                        <span className="font-light text-sm ml-1.5">ACA / Share</span>
                      </Typography>
                              </div>
                    <ButtonGroup size="sm" variant="gradient" color="amber">
                      <Button onClick={() => setBuyAnswerId(answer.id)}>Buy</Button>
                      <Button onClick={() => setSellAnswerId(answer.id)}>Sell</Button>
                    </ButtonGroup>
                  </div>
                </CardBody>
              </Card>
            )
          })}
          {
            !isLoading && data && data.items.length === 0 ? (
              <div className="text-center text-gray-600 py-4">Empty</div>
            ) : null
          }
        </div>
      </div>
    </>
  )
}

export function UserHoldings({ handle }: { handle: string }) {
  const { data: userData } = trpcQuery.users.info.useQuery({ handle })
  if (!userData) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return (
    <Holdings userId={userData.user.id} />
  )
}
