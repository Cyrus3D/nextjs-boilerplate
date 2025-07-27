"use client"

import Script from "next/script"

export default function AdsenseScript() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxxx"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
