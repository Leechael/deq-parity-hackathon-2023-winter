interface PageParams {
  id: string
}

export const metadata = {
  title: 'DeQ - Question',
}

export default function UserDetailPage({ params }: { params: PageParams }) { 
  const id = Number(params.id)
  return (
    <main className="container mx-auto sm:px-6 lg:px-8 min-h-screen pt-24 flex flex-col gap-8">
      {id}
    </main>
  )
}
