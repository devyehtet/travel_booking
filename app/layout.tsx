import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { LocaleProvider } from "@/lib/locale-context"
import { detectLocaleFromIP } from "@/app/actions/detect-locale"
import "./globals.css"

const GTM_ID = "GTM-5ZHHFT5W"
const GTAG_ID = "G-WKT390LNNE"
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`
const GTAG_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GTAG_ID}');`
const GTM_NOSCRIPT = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: GTAG_SCRIPT }} />
      </head>
      <body className={`font-sans antialiased`}>
        <noscript dangerouslySetInnerHTML={{ __html: GTM_NOSCRIPT }} />
        <LocaleProvider detectedLocale={detectedLocale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}
