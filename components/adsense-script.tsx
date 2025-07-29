import Script from "next/script"

export default function AdSenseScript() {
  return (
    <>
      {/* AdSense Verification Code */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2092124280694668"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  )
}
