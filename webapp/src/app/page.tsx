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
  await trpc.questions.lastest.prefetch({})

  return (
    <RehydrateHandler data={trpc.dehydrate()}>
      <main className="flex flex-1 min-h-screen flex-col items-center justify-between p-24">
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
