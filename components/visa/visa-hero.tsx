import { Shield, Clock, CheckCircle, GraduationCap } from "lucide-react"

export function VisaHero() {
  return (
    <section className="relative py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-primary-foreground/12 px-4 py-2 text-sm font-medium text-primary-foreground/90 backdrop-blur">
            <GraduationCap className="h-4 w-4" />
            ED Visa & ED Plus University Visa packages now available
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Visa & Immigration Services
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Complete immigration support for Myanmar nationals living in Thailand. Stay legal with our professional visa
            services.
          </p>
          <div className="mb-8 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-5 py-4 text-left text-primary-foreground/90 shadow-lg backdrop-blur">
            <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">New Education Packages</p>
            <p className="mt-2 text-lg font-semibold">ED Visa and ED Plus University Visa start from ฿57,000</p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Ask us about school intake timing, university coordination, and document checklists before you apply.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2 text-primary-foreground">
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Shield className="h-7 w-7" />
              </div>
              <p className="font-medium">100% Legal</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-primary-foreground">
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Clock className="h-7 w-7" />
              </div>
              <p className="font-medium">Fast Processing</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-primary-foreground">
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-7 w-7" />
              </div>
              <p className="font-medium">Myanmar Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
