"use client";
import { Button } from './material-tailwind'
import { useSession, signIn, signOut } from "next-auth/react"
export default () => {
  return (
    <>
      <Button onClick={() => signIn()}> Google sign in </Button>
      <Button onClick={() => signOut()}> Google sign out </Button>
    </>
  )
}