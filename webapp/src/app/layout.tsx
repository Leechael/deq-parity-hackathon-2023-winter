import './globals.css'
import { TrpcContextProvider } from '@/server/trpcProvider'
import { ThemeProvider } from '../components/material-tailwind'
import SessionProvider from "@/components/SessionProvider"
import WagmiProvider from "@/components/WagmiProvider"
import Login from "../components/Login"



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <TrpcContextProvider>
          <SessionProvider>
            <WagmiProvider>
              <ThemeProvider>
                <section className="flex">
                  <section className="flex fixed right-0 top-0 p-4 w-60 justify-center align-center">
                    <Login></Login>
                  </section>
                  {children}
                </section>
              </ThemeProvider>
            </WagmiProvider>
          </SessionProvider>
        </TrpcContextProvider>
      </body>
    </html>
  )
}
