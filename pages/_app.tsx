import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Analytics } from "@vercel/analytics/next"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for managing business operations" />
        <meta name="generator" content="Next.js" />
      </Head>
      <div className="font-sans">
        <Component {...pageProps} />
        <Analytics />
      </div>
    </>
  )
}