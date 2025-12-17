import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Fraunces, Padauk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LocaleProvider } from "@/lib/locale-context"
import { detectLocaleFromIP } from "@/app/actions/detect-locale"
import "./globals.css"

const _dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] })
const _padauk = Padauk({ subsets: ["myanmar"], weight: ["400", "700"] })

export const metadata: Metadata = {
  title: "Your Borders — Thailand Tours & Visa Services for Myanmar Travelers",
  description:
    "Your trusted gateway to Thailand. Premium tour packages across all Thai cities and expert visa services including VISA extensions, TM-30, and 90 Day Reports. Myanmar-friendly support.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const detectedLocale = await detectLocaleFromIP()

  return (
    <html lang={detectedLocale === "mm" ? "my" : "en"}>
      <body className={`font-sans antialiased`}>
        <LocaleProvider detectedLocale={detectedLocale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}
