"use client";
import { Button } from './material-tailwind'
import { useSession, signIn, signOut } from "next-auth/react"
const Login = () => {
  const { data: session } = useSession()
  if (session) {
    console.log(session)
    return (
      <Button onClick={() => signOut()}> Sign Out </Button>
    )
  }
  return (
    <Button onClick={() => signIn()}> Sign In </Button>
  )
}
export default Login