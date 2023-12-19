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
                <nav className="container flex flex-row justify-between items-center mx-auto px-8 py-4">
                  <a href="/"><img src="/logo.png" alt="logo" className="w-20" /></a>
                  <Login />
                </nav>
                {children}
              </ThemeProvider>
            </SessionProvider>
          </WagmiConfig>
        </TrpcContextProvider>
      </body>
    </html>
  )
}
