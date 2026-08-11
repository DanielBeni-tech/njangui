import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Njangi — la tontine, sans conflit',
  description:
    "Njangi digitalise votre tontine : règles claires, code d'invitation sécurisé, suivi des paiements en temps réel et notifications automatiques. Fini les malentendus sur qui a payé.",
  generator: 'v0.app',
  openGraph: {
    title: 'Njangi — la tontine, sans conflit',
    description:
      'Organisez votre tontine familiale ou entre collègues en toute transparence. Rejoignez la liste d’attente.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export const viewport: Viewport = {
  themeColor: '#7B2D8B',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
