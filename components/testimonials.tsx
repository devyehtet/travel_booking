"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const testimonials = {
  en: [
    {
      name: "Aung Kyaw",
      location: "Yangon, Myanmar",
      avatar: "/myanmar-man-professional-portrait.jpg",
      text: "When I came to Thailand, I used Your Borders. The tour package was excellent. Having a Myanmar-speaking guide was very convenient.",
      rating: 5,
      service: "Bangkok Tour",
    },
    {
      name: "Thandar Win",
      location: "Bangkok Resident",
      avatar: "/myanmar-woman-professional-portrait.jpg",
      text: "They helped me a lot with TM-30 and 90 day report. The process was fast and reliable. I recommend it to all Myanmar people living in Thailand.",
      rating: 5,
      service: "Visa Services",
    },
    {
      name: "Zaw Min Oo",
      location: "Mandalay, Myanmar",
      avatar: "/myanmar-young-man-casual-portrait.jpg",
      text: "The Phuket trip was incredible! Everything was arranged perfectly — airport pickup, hotels, and island hopping. Best experience in Thailand!",
      rating: 5,
      service: "Phuket Tour",
    },
  ],
  mm: [
    {
      name: "အောင်ကျော်",
      location: "ရန်ကုန်၊ မြန်မာ",
      avatar: "/myanmar-man-professional-portrait.jpg",
      text: "ကျွန်တော် ထိုင်းနိုင်ငံ လာတဲ့အခါ Your Borders ကို သုံးခဲ့ပါတယ်။ Tour package ကောင်းလိုက်တာ။ Myanmar speaking guide ရတာကလည်း အရမ်းအဆင်ပြေပါတယ်။",
      rating: 5,
      service: "ဘန်ကောက် ခရီးစဉ်",
    },
    {
      name: "သန္တာဝင်း",
      location: "ဘန်ကောက် နေထိုင်သူ",
      avatar: "/myanmar-woman-professional-portrait.jpg",
      text: "TM-30 နဲ့ 90 day report အတွက် အများကြီး ကူညီပေးခဲ့ပါတယ်။ Process က မြန်ဆန်ပြီး စိတ်ချရပါတယ်။ ထိုင်းမှာ နေထိုင်တဲ့ မြန်မာတွေအတွက် recommend ပါတယ်။",
      rating: 5,
      service: "ဗီဇာ ဝန်ဆောင်မှု",
    },
    {
      name: "ဇော်မင်းဦး",
      location: "မန္တလေး၊ မြန်မာ",
      avatar: "/myanmar-young-man-casual-portrait.jpg",
      text: "ဖူးခက် ခရီးစဉ်က အရမ်းကောင်းပါတယ်! အားလုံး ပြည့်စုံစွာ စီစဉ်ပေးထားတယ် — လေဆိပ် ကြိုပို့၊ ဟိုတယ်နဲ့ ကျွန်းပေါင်းစုံ ခရီးစဉ်။ ထိုင်းမှာ အကောင်းဆုံး အတွေ့အကြုံပါ!",
      rating: 5,
      service: "ဖူးခက် ခရီးစဉ်",
    },
  ],
}

export function Testimonials() {
  const { locale, t } = useLocale()
  const isMM = locale === "mm"
  const currentTestimonials = testimonials[locale]

  const stats = [
    { value: "5,000+", label: isMM ? "ကျေနပ်သော ခရီးသွားများ" : "Happy Travelers" },
    { value: "4.9", label: isMM ? "ပျမ်းမျှ အဆင့်သတ်မှတ်ချက်" : "Average Rating" },
    { value: "99%", label: isMM ? "ကျေနပ်မှု" : "Satisfaction" },
    { value: "24/7", label: isMM ? "ပံ့ပိုးကူညီမှု" : "Support" },
  ]

  return (
    <section className="py-28 bg-muted/50 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-5 ${isMM ? "font-myanmar" : ""}`}
          >
            <Star className="h-4 w-4 fill-primary" />
            {isMM ? "သုံးသပ်ချက်များ" : "Reviews"}
          </div>
          <h2
            className={`font-serif text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight text-balance ${isMM ? "font-myanmar" : ""}`}
          >
            {isMM ? "ထောင်ပေါင်းများစွာက " : "Trusted by "}
            <span className="text-gradient">{isMM ? "ယုံကြည်ကြသည်" : "Thousands"}</span>
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isMM ? "font-myanmar" : ""}`}>
            {isMM
              ? "Your Borders ကို ရွေးချယ်ခဲ့သော မြန်မာခရီးသွားများနှင့် နေထိုင်သူများထံမှ အစစ်အမှန် ဇာတ်လမ်းများ။"
              : "Real stories from Myanmar travelers and residents who chose Your Borders."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden ${
                index === 1 ? "md:-translate-y-4" : ""
              }`}
            >
              <div className="absolute top-4 right-4 text-primary/8">
                <Quote className="h-14 w-14 fill-current" />
              </div>

              <CardContent className="p-7 relative">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                <p className={`text-foreground mb-7 leading-relaxed ${isMM ? "font-myanmar" : ""}`}>
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-5 border-t border-border">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-foreground ${isMM ? "font-myanmar" : ""}`}>{testimonial.name}</p>
                    <p className={`text-sm text-muted-foreground truncate ${isMM ? "font-myanmar" : ""}`}>
                      {testimonial.location}
                    </p>
                  </div>
                  <div
                    className={`bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium shrink-0 ${isMM ? "font-myanmar" : ""}`}
                  >
                    {testimonial.service}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-2 tracking-tight">
                {stat.value}
              </p>
              <p className={`text-muted-foreground text-sm font-medium ${isMM ? "font-myanmar" : ""}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
