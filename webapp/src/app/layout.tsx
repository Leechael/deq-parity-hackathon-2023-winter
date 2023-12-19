'use client';

import './globals.css'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'


import { TrpcContextProvider } from '@/server/trpcProvider'
import { mandala } from '@/utils/chains'

import { ThemeProvider } from '../components/material-tailwind'
import SessionProvider from "@/components/SessionProvider"
import WagmiProvider from "@/components/WagmiProvider"
import Login from "../components/Login"

// const config = createConfig({
//   autoConnect: true,
//   publicClient: createPublicClient({
//     chain: mandala,
//     // chain: polygonMumbai,
//     transport: http(),
//   })
// })
const { chains, publicClient } = configureChains([mandala], [publicProvider()])
const config = createConfig({
  connectors: [
    new InjectedConnector({ chains })
  ],
  publicClient,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <TrpcContextProvider>
          <WagmiConfig config={config}>
            <SessionProvider>
              <ThemeProvider>
                <section className="flex">
                  <section className="flex fixed right-0 top-0 p-4 w-60 justify-center align-center">
                    <Login></Login>
                  </section>
                  {children}
                </section>
              </ThemeProvider>
            </SessionProvider>
          </WagmiConfig>
        </TrpcContextProvider>
      </body>
    </html>
  )
}
