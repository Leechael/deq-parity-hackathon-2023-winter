import './globals.css'
import { TrpcContextProvider } from '@/server/trpcProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TrpcContextProvider>
          {children}
        </TrpcContextProvider>
      </body>
    </html>
  )
}
