'use client';

import { trpcQuery } from '@/server/trpcProvider'
import Link from 'next/link'
import {
  Spinner,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Avatar,
} from '@material-tailwind/react'

import { MarkdownView } from '@/components/MarkdownView'
import { formatRelativeTime } from '@/utils/datetime'
import cn from '@/utils/cn';

export function AnswerList({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.answers.getByQuestionId.useQuery({ id })
  return (
    <div className="flex flex-col align-center gap-8 pl-8">
      {
        isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
        ) : null
      }
      {data && data.items.map(answer => (
        <Card
          key={answer.id}
          shadow={false}
          className={cn("w-full rounded-3xl p-8 pt-4", answer?.picked ? "bg-[#eef9fd]" : "bg-[#faf3e8]")}
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
          </CardBody>
          {/* <CardFooter> */}
          {/*   <Button>Choose</Button> */}
          {/* </CardFooter> */}
        </Card>
      ))}
    </div>
  )
}
