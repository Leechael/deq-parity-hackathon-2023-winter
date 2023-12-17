"use client";
import { Button } from './material-tailwind'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'

const Login = () => {
  const { data: session } = useSession()
  const router = useRouter()
  if (session) {
    console.log(session)
    return (
      <Button onClick={() => signOut()}> Sign Out </Button>
    )
  }
  return (
    <Button onClick={() => router.push('/signIn')}> Sign In </Button>
  )
}
export default Login