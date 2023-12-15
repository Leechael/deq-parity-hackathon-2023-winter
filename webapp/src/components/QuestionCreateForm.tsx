'use client';

import { useQueryClient } from '@tanstack/react-query'
import * as R from 'ramda'

import { trpcQuery } from '@/server/trpcProvider'


export function QuestionCreateForm() {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = trpcQuery.questions.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['questions.lastest'])
    }
  })
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <form onSubmit={e => {
        e.preventDefault()
        mutate({
          title: R.pathOr('', ['target', 'title', 'value'], e),
          body: R.pathOr('', ['target', 'body', 'value'], e),
        })
      }}>
        <div>
          <label>Title</label>
          <input name="title" />
        </div>
        <div>
          <label>Body</label>
          <textarea name="body" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
