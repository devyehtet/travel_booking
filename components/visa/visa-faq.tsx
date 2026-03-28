import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "ED Visa packages ဘယ်လောက်ကနေ စလဲ?",
    answer:
      "Our ED Visa packages start from ฿57,000. The final quote depends on the school, course length, and document requirements. We can check your case first and give you a clear package breakdown before you commit.",
  },
  {
    question: "What is ED Plus University Visa?",
    answer:
      "ED Plus University Visa is a university-based education visa route for clients who want a longer-term academic option in Thailand. We help with university coordination, intake timing, admissions paperwork, and the immigration document checklist from start to finish.",
  },
  {
    question: "TM-30 ဆိုတာ ဘာလဲ? ဘယ်သူတွေ လိုအပ်သလဲ?",
    answer:
      "TM-30 သည် ထိုင်းနိုင်ငံတွင် နေထိုင်သော နိုင်ငံခြားသားများအတွက် လိပ်စာ စာရင်းသွင်းခြင်း ပုံစံဖြစ်ပါသည်။ ထိုင်းနိုင်ငံသို့ ရောက်ရှိပြီး နာရီ ၂၄ နာရီအတွင်း သို့မဟုတ် လိပ်စာ ပြောင်းရွှေ့တိုင်း သတင်းပို့ရန် လိုအပ်ပါသည်။",
  },
  {
    question: "What is the 90 Day Report and who needs to file it?",
    answer:
      "The 90 Day Report is mandatory for any foreigner staying in Thailand for more than 90 consecutive days. You must report to Immigration every 90 days. We can help you file this report either in person or online.",
  },
  {
    question: "How long does a tourist visa extension take?",
    answer:
      "A tourist visa extension typically takes 5-7 working days. You can extend your tourist visa by 30 days at Thai Immigration. We handle all the paperwork and can accompany you to Immigration if needed.",
  },
  {
    question: "Can you help with work permit applications?",
    answer:
      "Yes, we provide complete work permit assistance including new applications, renewals, job changes, and address changes. We coordinate with both Immigration and the Department of Employment.",
  },
  {
    question: "ဘာ documents တွေ လိုအပ်သလဲ?",
    answer:
      "လိုအပ်သော documents များသည် ဝန်ဆောင်မှု အမျိုးအစားပေါ် မူတည်ပါသည်။ ပုံမှန်အားဖြင့် passport, visa, photos, နှင့် application forms များ လိုအပ်ပါသည်။ ကျွန်ုပ်တို့က သင့်အတွက် လိုအပ်သော documents အားလုံးကို list လုပ်ပေးပါမည်။",
  },
  {
    question: "Is your service legal and official?",
    answer:
      "Yes, absolutely. We operate as a legal visa assistance service. All applications are processed through official Thai Immigration channels. We simply help with preparation, documentation, and navigation of the process.",
  },
]

export function VisaFAQ() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Common questions about our visa services (Myanmar & English)
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
