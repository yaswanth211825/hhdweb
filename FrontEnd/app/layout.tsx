import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AppProviders } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: 'Happy Home Developers | Quality Construction in Bangalore',
  description: 'Trusted construction partner in Bangalore. Residential homes, commercial projects, renovations & custom builds. 10+ years of quality craftsmanship.',
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
