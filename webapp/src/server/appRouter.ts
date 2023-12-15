import { z } from 'zod'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { publicProcedure, router } from './router'
import { createInternalContext } from './context'
import prisma from './db'

//
// Output Schemas
//

const QuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  createdAt: z.date(),
  user: z.object({
    id: z.number(),
    handle: z.string(),
  }),
})


//
// Routes
//

const listLatestQuestions = publicProcedure
  .input(z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
  }))
  .output(z.object({
    items: z.array(QuestionSchema)
  }))
  .query(async ({ input: { page, limit }}) => {
    const items = await prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
      },
    })
    return { items }
  })

const createQuestion = publicProcedure
  .input(z.object({
    title: z.string(),
    body: z.string(),
  }))
  .output(QuestionSchema)
  .mutation(async ({ input: { title, body } }) => {
    const question = await prisma.question.create({
      data: {
        title,
        body,
        userId: 1,
      },
      include: {
        user: true,
      }
    })
    return question
  })



//
// Final
//

const questionRouter = router({
  lastest: listLatestQuestions,
  create: createQuestion,
})

export const appRouter = router({
  questions: questionRouter,
})

export type AppRouter = typeof appRouter

export async function useTrpcPreload() {
  const ctx = await createInternalContext()
  return createServerSideHelpers({
    router: appRouter,
    ctx,
  })
}
