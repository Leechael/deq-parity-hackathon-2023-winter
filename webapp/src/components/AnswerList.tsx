'use client';

import { trpcQuery } from '@/server/trpcProvider'
import Link from 'next/link'
import {
  Spinner,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Button,
} from "@/components/material-tailwind";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function AnswerList({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.answers.getByQuestionId.useQuery({ id })
  return (
    <div className="flex flex-col align-center gap-8 pb-8">
      {
        isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
        ) : null
      }
      {data && data.items.map(answer => (
        <Card key={answer.id} className="w-full">
          <CardHeader floated={false} color="blue-gray" className="flex flex-col p-4">
            <Link href={`/u/${answer.user.handle}`} target="_blank">
              <Typography variant="small">
                @{answer.user.name}
              </Typography>
            </Link>
          </CardHeader>
          <CardBody className="flex flex-col">
            <Link href={`/answers/${answer.id}`} target="_blank">
              <Markdown remarkPlugins={[remarkGfm]}>{answer.body}</Markdown>
            </Link>
          </CardBody>
          <CardFooter>
            <Button>Choose</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
