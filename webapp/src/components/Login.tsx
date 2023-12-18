"use client";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react"
import { Button, Menu, MenuHandler, MenuList, MenuItem } from '@/components/material-tailwind'


import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'
import { SiweMessage } from "siwe"

const Login = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { connect, isLoading, error } = useConnect({
    connector: new InjectedConnector(),
  })
  // const { disconnect } = useDisconnect()

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
      return res
    }
    await signIn(sType)
  }

  useEffect(() => {
    if (isConnected && !session) {
      onSignIn('credentials')
    }
  }, [isConnected])

  if (session) {
    return (
      <Button onClick={() => signOut()}>Sign Out</Button>
    )
  }
  return (
    // <Button onClick={() => router.push('/signIn')}> Sign In </Button>
    <Menu>
      <MenuHandler>
        <Button loading={status === 'loading'}>Sign In</Button>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={() => onSignIn('google')}>SIGN IN WITH GOOGLE</MenuItem>
        <MenuItem onClick={() => onSignIn('github')}>SIGN IN WITH GITHUB</MenuItem>
        <hr className="my-3" />
        <MenuItem onClick={() => connect()}>SIGN IN WITH METAMASK</MenuItem>
      </MenuList>
    </Menu>
  )
}
export default Login