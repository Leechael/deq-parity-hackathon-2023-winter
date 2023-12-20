'use client';

import { trpcQuery } from '@/server/trpcProvider'
import {
  Avatar,
  Card,
  CardBody,
  Spinner,
  Typography,
} from '@material-tailwind/react'

export function QuestionView({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.questions.getById.useQuery({ id })
  return (
    <Card className='w-full'>
      <CardBody>
        {isLoading ? <Spinner className="mx-auto" /> : null}
        {data ? (
          <div className="flex flex-col gap-4">
            <Typography variant="h2">{data.title}</Typography>
            <div className="flex flex-row gap-1 items-center">
              <Avatar
                src="https://docs.material-tailwind.com/img/face-2.jpg"
                alt="avatar"
                className="p-0.5"
                size="sm"
              />
              <div>
                <Typography color="gray" className="font-medium">@{data.user.handle}</Typography>
              </div>
            </div>
            <Typography className="leading-7">
              {data.body}
            </Typography>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}
