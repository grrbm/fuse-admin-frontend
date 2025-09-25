import Head from "next/head"
import { useRouter } from "next/router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Layout from "@/components/Layout"
import { ArrowRight, Check, CreditCard, ShieldCheck } from "lucide-react"

const platformOptions = [
  {
    id: "standard",
    label: "Standard",
    price: "$1,500 / month",
    description: "Core software to manage patient journeys, connect with Fuse telehealth physicians, and automate pharmacy fulfillment.",
    icon: CreditCard,
    highlight: "Ideal for wellness, aesthetics, weight-loss, and lifestyle telehealth brands that don’t require controlled scripts.",
    recommended: true,
  },
  {
    id: "controlled-substances",
    label: "Controlled Substances",
    price: "$2,500 / month",
    description:
      "Everything in the standard package plus the workflows you need to prescribe regulated therapies through Fuse doctors and pharmacies.",
    icon: ShieldCheck,
    highlight: "Perfect for clinics offering TRT (testosterone replacement), growth-hormone releasing peptides, and other Schedule III therapies that require DEA licensure.",
  },
]

const steps = [
  { label: "Step 1", title: "Choose platform", description: "Pick the Fuse package that matches your clinic's services." },
  {
    label: "Step 2",
    title: "Choose onboarding",
    description: "Select the build-out experience (Standard, High Definition, or Custom).",
  },
  {
    label: "Step 3",
    title: "Commit to getting started",
    description: "Secure onboarding and platform access via Stripe checkout.",
  },
  {
    label: "Step 4",
    title: "Launch in 1–2 weeks",
    description: "Fuse configures the platform, connects doctors and pharmacies, and activates your patient journey.",
  },
]

export default function PlansPage() {
  const router = useRouter()

  const handleGetStarted = (platformId: string) => {
    router.push({ pathname: "/plans/onboarding", query: { platform: platformId } })
  }

  return (
    <Layout>
      <Head>
        <title>Plans & Pricing – Fuse Admin</title>
        <meta
          name="description"
          content="Select the Fuse Admin platform tier that powers your telehealth operations, then continue to onboarding experiences tailored to your launch."
        />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <section className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Power your telehealth brand with Fuse</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Fuse connects your clinic to board-certified telehealth physicians and fulfillment pharmacies—no patchwork systems needed.
              Pick the monthly platform that fits your services to keep building momentum.
            </p>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {platformOptions.map((option) => (
              <div
                key={option.id}
                className={`relative rounded-2xl border shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl ${
                  option.recommended
                    ? "border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background shadow-primary/10"
                    : "border-border/60 bg-card/50 hover:border-primary/30"
                }`}
              >
                {option.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs uppercase tracking-wide shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className="h-full border-none bg-transparent shadow-none">
                  <CardHeader className="space-y-3">
                    <Badge className="w-fit bg-primary/90 text-primary-foreground">Monthly</Badge>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <option.icon className="h-6 w-6 text-primary" />
                      {option.label}
                    </CardTitle>
                    <CardDescription className="text-xl font-semibold text-foreground">
                      {option.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{option.highlight}</span>
                    </div>
                    <Button className="mt-4 w-full" size="lg" onClick={() => handleGetStarted(option.id)}>
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </section>

          <section className="mt-12 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={`flex flex-col rounded-xl border p-4 md:flex-row md:items-center md:gap-4 ${
                  index === 0 ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 bg-card/50"
                }`}
              >
                <Badge className={`${index === 0 ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border-primary/20"}`}>
                  {step.label}
                </Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">Not sure which path fits?</CardTitle>
                  <CardDescription className="max-w-xl text-base">
                    Chat with an onboarding specialist about multi-location launches, marketing assets, or compliance planning. We’ll align
                    on a plan and next steps in one call.
                  </CardDescription>
                </div>
                <Button asChild size="lg" className="font-semibold">
                  <a href="mailto:onboarding@fusehealth.com?subject=Fuse%20Onboarding%20Consult">
                    Talk to an expert
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  )
}