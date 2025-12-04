import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/src/components/provider/theme-provider'
import { WalletProvider } from '@/src/components/provider/WalletProvider'
import './globals.css'
import { Toaster } from "sonner";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AEGIS Protocol - DeFi Lending & Borrowing',
  description: 'Decentralized lending and borrowing protocol built for the future of DeFi. Secure, efficient, and community-driven.',
  keywords: ['DeFi', 'lending', 'borrowing', 'cryptocurrency', 'blockchain', 'AEGIS', 'Cedra'],
  authors: [{ name: 'AEGIS Protocol Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <WalletProvider>
            {children}
        </WalletProvider>
        <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}