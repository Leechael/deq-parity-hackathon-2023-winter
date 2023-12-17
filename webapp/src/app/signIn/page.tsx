"use client";
import { useEffect, useState } from "react"
// import { useSession, signIn, signOut } from "next-auth/react"
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/material-tailwind'


import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'
import { SiweMessage } from "siwe"


function SignInComp() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { connect, isLoading, error } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const onSignIn = async (sType: string) => {
    if (sType === 'credentials') {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      const res = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      })
      console.log(res)
      router.replace('/')
      return
    }
    await signIn(sType)
  }
  useEffect(() => {
    if (isConnected && !session) {
      onSignIn('credentials')
    }
  }, [isConnected])
  return (
    <div className="flex flex-col items-center">
      <Button onClick={() => onSignIn('google')}>google</Button>
      <Button onClick={() => onSignIn('github')}>github</Button>
      <div>{address}</div>
      <div>{isConnected}</div>
      {isConnected ? <Button onClick={() => disconnect()}>disconnect</Button> : <Button onClick={() => connect()}>connect metamask</Button>
      }
      {error && <span>{error.message}</span>}
      {isConnected ? <Button onClick={() => onSignIn('credentials')}>signin with metamask</Button> : null}
    </div>
  )
}
export default SignInComp