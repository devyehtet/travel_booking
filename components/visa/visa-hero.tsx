import { Shield, Clock, CheckCircle } from "lucide-react"

export function VisaHero() {
  return (
    <section className="relative py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Visa & Immigration Services
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Complete immigration support for Myanmar nationals living in Thailand. Stay legal with our professional visa
            services.
          </p>
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
