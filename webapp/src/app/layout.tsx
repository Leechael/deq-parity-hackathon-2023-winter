import './globals.css'
import { TrpcContextProvider } from '@/server/trpcProvider'
import { ThemeProvider } from './components/material-tailwind'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TrpcContextProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </TrpcContextProvider>
      </body>
    </html>
  )
}
