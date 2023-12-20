import { useTrpcPreload } from '@/server/appRouter'
import { RehydrateHandler } from '@/server/trpcProvider'
import { QuestionList } from '@/components/QuestionList'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tab,
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
} from "@/components/material-tailwind";
import AskButton from '@/components/AskButton'

export const metadata = {
  title: 'DeQ',
}

export default async function Home() {
  const trpc = await useTrpcPreload()
  // await Promise.all([
  //   trpc.questions.lastest.prefetch({ type: 'hot' }),
  //   trpc.questions.lastest.prefetch({ type: 'unanswer' }),
  // ])

  return (
    <RehydrateHandler data={trpc.dehydrate()}>
      <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
        <div className="flex flex-col w-[700px]">
          <AskButton />
          <Tabs value="Hot" className="pt-6 mt-6">
            <Card className="flex flex-col items-center">
              <CardHeader color="blue-gray" className="relative w-60">
                <TabsHeader >
                  <Tab key="Hot" value="Hot">
                    Hot
                  </Tab>
                  <Tab key="Unanswer" value="Unanswer">
                    Unanswer
                  </Tab>
                </TabsHeader>
              </CardHeader>
              <CardBody>

                <TabsBody>
                  <TabPanel key="Hot" value="Hot">
                    <QuestionList type="hot" />
                  </TabPanel>
                  <TabPanel key="Unanswer" value="Unanswer">
                    <QuestionList type="unanswer" />
                  </TabPanel>

                </TabsBody>
              </CardBody>
            </Card>
          </Tabs >
        </div>
      </main>
    </RehydrateHandler>
  )
}
