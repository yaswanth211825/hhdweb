import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AppProviders } from "./providers"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: 'HappyHomeBuilders | Design Your Dream Home',
  description: 'Explore ready floor plans or generate your own in seconds. 10+ years experience, 500+ homes built, 1000+ floor plans available.',
  icons: {
    icon: '/happyhome-favicon.svg',
    shortcut: '/happyhome-favicon.svg',
    apple: '/happyhome-favicon.svg',
  },
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
