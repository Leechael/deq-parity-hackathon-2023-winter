'use client';

import { trpcQuery } from '@/server/trpcProvider'

export function FooComp() {
  const { data, isLoading } = trpcQuery.ciao.useQuery()
  console.log('client-side', isLoading)
  return (
    <pre className="mx-auto w-[540px] h-[300px] overflow-scroll">{JSON.stringify(data, null, 2)}</pre>
  )
}
