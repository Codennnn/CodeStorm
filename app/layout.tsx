import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC } from 'next/font/google'

import { getPageTitle } from '~/util'

import '~/styles/reset.css'
import '~/styles/globals.css'

export const metadata: Metadata = {
  icons: [
    { url: '/favicon.ico', sizes: '32x32', rel: 'icon' },
    {
      url: '/favicon.svg',
      type: 'image/svg+xml',
      media: '(prefers-color-scheme: light)',
      sizes: 'any',
      rel: 'icon',
    },
    {
      url: '/favicon-dark.svg',
      type: 'image/svg+xml',
      media: '(prefers-color-scheme: dark)',
      sizes: 'any',
      rel: 'icon',
    },
  ],
  title: getPageTitle(),
  description: '陈梓聪的代码实验室',
  authors: [{ name: '陈梓聪 LeoKu', url: 'https://github.com/Codennnn' }],
  metadataBase: new URL('https://leoku.dev'),
  openGraph: {
    type: 'website',
    title: "LeoKu's Lab",
    description: 'My personal website',
    url: 'https://leoku.dev',
    images: 'https://i.imgur.com/Cvgeu1S.png',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LeoKu's Lab",
    description: 'My personal website',
    images: 'https://i.imgur.com/Cvgeu1S.png',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  colorScheme: 'light',
}

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html className={notoSansSC.className} lang="zh-Hans-CN">
      <body>{props.children}</body>
    </html>
  )
}
