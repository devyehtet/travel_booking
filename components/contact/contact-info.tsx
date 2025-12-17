import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook } from "lucide-react"

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    value: "+66 XX XXX XXXX",
    description: "Call us anytime",
  },
  {
    icon: MessageCircle,
    title: "Line / Viber",
    value: "@thaimyanmar",
    description: "Message us directly",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@thaimyanmar.com",
    description: "We reply within 24 hours",
  },
  {
    icon: Facebook,
    title: "Facebook",
    value: "ThaiMyanmar Travel",
    description: "Follow us for updates",
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Get in Touch</h2>
        <p className="text-muted-foreground">
          We are available to help you with tour bookings and visa services. Contact us through any of these channels.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contactMethods.map((method) => (
          <Card key={method.title} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <method.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{method.title}</p>
                <p className="font-semibold text-foreground">{method.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Office Location</p>
              <p className="font-semibold text-foreground">Bangkok, Thailand</p>
              <p className="text-sm text-muted-foreground mt-1">
                Sukhumvit Area, Bangkok
                <br />
                (Near BTS Station)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Office Hours</p>
              <p className="font-semibold text-foreground">Monday - Saturday</p>
              <p className="text-sm text-muted-foreground mt-1">9:00 AM - 6:00 PM (Thailand Time)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted">
        <CardContent className="p-6">
          <h3 className="font-serif font-semibold text-lg text-foreground mb-2">Myanmar Speaking Support</h3>
          <p className="text-muted-foreground mb-4">
            ကျွန်ုပ်တို့သည် မြန်မာဘာသာစကားဖြင့် ဝန်ဆောင်မှုပေးပါသည်။ သင်၏ tour booking နှင့် visa ကိစ္စများအတွက် ကူညီပေးနိုင်ပါသည်။
          </p>
          <p className="text-sm text-foreground">We speak Myanmar and are here to help with all your needs!</p>
        </CardContent>
      </Card>
    </div>
  )
}
