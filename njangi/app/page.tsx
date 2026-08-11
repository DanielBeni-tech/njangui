import { Faq } from '@/components/faq'
import { Features } from '@/components/features'
import { FinalCta } from '@/components/final-cta'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { ProblemSection } from '@/components/problem-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Testimonials } from '@/components/testimonials'
import { TrustSection } from '@/components/trust-section'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <TrustSection />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
