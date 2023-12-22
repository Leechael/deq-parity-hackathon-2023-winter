import { UserHoldings } from '@/components/UserHoldings'
import { UserProfile } from '@/components/UserProfile'
import { QuestionCreateForm } from '@/components/QuestionCreateForm'

interface PageParams {
  handle: string
}

export const metadata = {
  title: 'DeQ - User',
}

export default function UserDetailPage({ params }: { params: PageParams }) { 
  const handle = params.handle
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen flex flex-col gap-8">
      <div className="flex flex-row gap-4">
        <div className="self-stretch grow">
          <UserProfile handle={handle} />
        </div>
        <QuestionCreateForm
          actionButtonLabel="Send Offer"
        />
      </div>
      <UserHoldings handle={handle} />
    </main>
  )
}
