import { FileSearch, FileCheck, Send, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileSearch,
    step: "01",
    title: "Consultation",
    description: "Contact us with your visa needs. We'll assess your situation and recommend the best option.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Document Preparation",
    description: "We guide you on required documents and help prepare all necessary paperwork.",
  },
  {
    icon: Send,
    step: "03",
    title: "Submission",
    description: "We submit your application to Thai Immigration on your behalf or accompany you.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Approval",
    description: "Receive your approved visa or documents. We follow up until completion.",
  },
]

export function VisaProcess() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process to handle all your visa and immigration needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6">
                    <step.icon className="h-9 w-9 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-xl text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
