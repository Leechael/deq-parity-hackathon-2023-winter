import { TRPCError } from '@trpc/server';
import { z } from 'zod'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { publicProcedure, protectedProcedure, router } from './router'
import { createInternalContext } from './context'
import prisma from './db'
import { TRPCClientError } from '@trpc/client'

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
    name: z.string().nullable(),
    handle: z.string().nullable(),
  }),
  answers: z.array(z.object({
    id: z.number(),
    body: z.string(),
    user: z.object({
      id: z.number(),
      name: z.string().nullable(),
      handle: z.string().nullable(),
      // avatar: z.string(),
    })
  })),
})


//
// Routes
//

const listLatestQuestions = publicProcedure
  .input(z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    type: z.string().default('hot'),
  }))
  .output(z.object({
    items: z.array(QuestionSchema)
  }))
  .query(async ({ input: { page, limit, type } }) => {
    let where = {}
    if (type === 'unanswer') {
      where = { answers: { none: {} } }
    }
    const items = await prisma.question.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        answers: { include: { user: true } },
      },
    })
    return { items }
  })

const createQuestion = protectedProcedure
  .input(z.object({
    title: z.string(),
    body: z.string(),
  }))
  .output(QuestionSchema.omit({ answers: true }))
  .mutation(async ({ input: { title, body }, ctx: { currentUser } }) => {
    const question = await prisma.question.create({
      data: {
        title,
        body,
        userId: currentUser.id,
      },
      include: {
        user: true,
      }
    })
    return question
  })

const createAnswer = protectedProcedure
  .input(z.object({
    tokenId: z.number(),
    questionId: z.number(),
    body: z.string(),
  }))
  .mutation(async ({ input: { tokenId, questionId, body }, ctx: { currentUser } }) => {
    const answer = await prisma.answer.create({
      data: {
        body,
        tokenId,
        questionId,
        userId: currentUser.id,
      },
      include: {
        user: true,
      }
    })
    return answer
  })

const getAnswer = publicProcedure
  .input(z.object({
    id: z.number(),
  }))
  .query(async ({ input: { id } }) => {
    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        user: true,
        question: true,
      }
    })
    return answer
  })

const setUserHandleName = protectedProcedure
  .input(z.object({
    handle: z.string(),
    name: z.string(),
    check: z.boolean().default(false),
  }))
  .mutation(async ({ input: { handle, name, check }, ctx: { currentUser } }) => {
    const existHandleUser = await prisma.user.findUnique({ where: { handle } })
    if (existHandleUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Handle exists' })
    }
    if (!check) {
      const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          handle, name
        }
      })
      return user
    }
  })

//
// Final
//

const questionRouter = router({
  lastest: listLatestQuestions,
  create: createQuestion,
})

const answerRouter = router({
  create: createAnswer,
  get: getAnswer,
})

const userRouter = router({
  setHandleName: setUserHandleName,
  // TODO checker
})

export const appRouter = router({
  questions: questionRouter,
  answers: answerRouter,
  users: userRouter
})

export type AppRouter = typeof appRouter

export async function useTrpcPreload() {
  const ctx = await createInternalContext()
  return createServerSideHelpers({
    router: appRouter,
    ctx,
  })
}
