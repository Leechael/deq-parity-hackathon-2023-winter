'use client';

import { trpcQuery } from '@/server/trpcProvider'
import {
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  ButtonGroup,
  Button,
} from "@/components/material-tailwind";
import Markdown from 'react-markdown'

export function QuestionList({ type }: { type: string }) {
  const { data, isLoading } = trpcQuery.questions.lastest.useQuery({ type })
  const onAddAnswer = () => {
    console.log('onAddAnswer')
  }
  if (isLoading) {
    return <Spinner />
  }
  return (
    <div className="flex flex-col align-center gap-8">
      {data && data.items.map(question => (
        <Card key={question.id}>
          <CardHeader floated={false} color="blue-gray" className="flex flex-col p-4">
            <Typography variant="small">{question.user.name}</Typography>
            <Typography variant="h6">{question.title}</Typography>
            {/* <Typography variant="paragraph">{question.body}</Typography> */}
            <Markdown>{question.body}</Markdown>
          </CardHeader>
          <CardBody className="flex flex-col">
            {question.answers?.length ?
              <List >
                {question.answers.map((answer) => (
                  <ListItem key={answer.id} className="flex items-start">
                    <ListItemPrefix className="w-24 flex-shrink-0">
                      <Avatar variant="circular" alt={answer.user.name} src="https://docs.material-tailwind.com/img/face-1.jpg" />
                      <Typography variant="small">{answer.user.name}</Typography>
                    </ListItemPrefix>
                    <div>
                      {/* <Typography variant="paragraph">{answer.body}</Typography> */}
                      <Markdown>{answer.body}</Markdown>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col">
                          <Typography variant="h5">$1800</Typography>
                          <Typography variant="small">0.4 dot / share</Typography>
                        </div>
                        <ButtonGroup size="sm" variant="outlined">
                          <Button>Buy TODO</Button>
                          <Button>Sell TODO</Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
              : (
                <Typography variant="h6">No answer yet.</Typography>
              )}
          </CardBody>
          <CardFooter>
            <Button onClick={onAddAnswer}>Add my answer</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
