import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IDO Tdo',
  description: 'I can do it',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Layout> {children} </Layout>
  )
}
