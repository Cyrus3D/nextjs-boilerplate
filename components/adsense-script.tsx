"use client"

import Script from "next/script"

export default function AdsenseScript() {
  // AdSense client ID from verification code
  const adClient = "ca-pub-2092124280694668"

  return (
    <>
      {/* Additional AdSense initialization if needed */}
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${adClient}",
              enable_page_level_ads: true
            });
          `,
        }}
      />
    </>
  )
}
