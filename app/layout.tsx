import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { GtagAutoEvents } from "@/components/tracking/gtag-auto-events"
import { LocaleProvider } from "@/lib/locale-context"
import { detectLocaleFromIP } from "@/app/actions/detect-locale"
import "./globals.css"

const GTM_ID = "GTM-5ZHHFT5W"
const GOOGLE_ANALYTICS_ID = "G-WKT390LNNE"
const GOOGLE_ADS_TAG_ID = "GT-TNLZKVFH"
const GOOGLE_ADS_CHILD_ACCOUNT_CONVERSION_ID = "AW-18038410405"
const META_PIXEL_ID = "1872265306813577"
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`
const GTAG_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_ID}', { send_page_view: false });
gtag('config', '${GOOGLE_ADS_TAG_ID}');
gtag('config', '${GOOGLE_ADS_CHILD_ACCOUNT_CONVERSION_ID}');`
const META_PIXEL_SCRIPT = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`
const GTM_NOSCRIPT = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
const META_PIXEL_NOSCRIPT = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`

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
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: GTAG_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_SCRIPT }} />
      </head>
      <body className={`font-sans antialiased`}>
        <noscript dangerouslySetInnerHTML={{ __html: GTM_NOSCRIPT }} />
        <noscript dangerouslySetInnerHTML={{ __html: META_PIXEL_NOSCRIPT }} />
        <Suspense fallback={null}>
          <GtagAutoEvents />
        </Suspense>
        <LocaleProvider detectedLocale={detectedLocale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}
