import { useMemo, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Layout from "@/components/Layout"
import { ArrowLeft, ArrowRight, Check, Handshake, MonitorSmartphone, Sparkles } from "lucide-react"

const onboardingPlans = [
  {
    id: "standard",
    name: "Standard Build",
    onboardingFee: "$3,000",
    headline: "Launch fast with Fuse doctors and pharmacies connected to your brand-ready static site or existing web presence.",
    deliverables: [
      "Go-live in under 30 days",
      "Fuse platform + telehealth physician configuration",
      "Branded static info page or website hand-off",
      "Initial data + provider import",
      "Live training for your patient and support teams",
    ],
    ctaLabel: "Choose Standard",
    supportsLegitScriptAddon: true,
  },
  {
    id: "high-definition",
    name: "High Definition",
    onboardingFee: "$5,000",
    headline: "Elevated design, richer content, and automation to convert patients for telehealth services from day one.",
    deliverables: [
      "Everything in Standard",
      "Custom multi-section marketing site",
      "Conversion copy and photography direction",
      "Advanced workflow + automation build-out",
      "60-day optimization + analytics review",
    ],
    ctaLabel: "Choose High Definition",
    recommended: true,
    supportsLegitScriptAddon: true,
  },
  {
    id: "custom",
    name: "Custom Implementation",
    onboardingFee: "$20,000",
    headline: "Enterprise rollout with LegitScript certification, bespoke integrations, and multi-brand support included.",
    deliverables: [
      "Technical discovery + architecture sprint",
      "Full LegitScript certification submission",
      "Complex integration & data migration plan",
      "Multi-location / multi-brand configuration",
      "Stakeholder training and executive launch workshop",
    ],
    ctaLabel: "Book Custom Project Call",
    isCustom: true,
  },
]

const platformLabels: Record<string, string> = {
  standard: "Fuse Admin Platform",
  "controlled-substances": "Fuse Admin + Controlled Substances",
}

export default function OnboardingPlansPage() {
  const router = useRouter()
  const platform = typeof router.query.platform === "string" ? router.query.platform : null
  const [legitScriptAddons, setLegitScriptAddons] = useState({
    standard: false,
    "high-definition": false,
  })

  const headingLabel = useMemo(() => platformLabels[platform ?? ""] ?? "Fuse Admin Platform", [platform])

  const toggleLegitScriptAddon = (planId: "standard" | "high-definition") => {
    setLegitScriptAddons((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }))
  }

  const handleBack = () => {
    router.push("/plans")
  }

  const handleSelect = (planId: string) => {
    const includeLegitScript = legitScriptAddons[planId as "standard" | "high-definition"]
    const message = includeLegitScript
      ? `Selected ${planId} onboarding with expedited LegitScript certification.`
      : `Selected ${planId} onboarding.`
    alert(message)
  }

  return (
    <Layout>
      <Head>
        <title>Choose Onboarding – Fuse Admin</title>
        <meta
          name="description"
          content="Select the Fuse Admin onboarding experience that matches your telehealth launch timeline, branding needs, and compliance requirements."
        />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="gap-2" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back to platform plans
            </Button>
            {platform && (
              <Badge className="bg-primary/10 text-primary border-primary/20">{headingLabel}</Badge>
            )}
          </div>

          <section className="mt-8 text-center">
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Pick your onboarding experience</h1>
            <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
              Fuse onboarding is where we connect your chosen platform tier to our telehealth doctors, pharmacy partners, and patient
              marketing engine. Select the path that aligns with your brand vision and urgency.
            </p>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {onboardingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl ${
                  plan.recommended
                    ? "border-primary/30 bg-gradient-to-br from-primary/15 via-background to-background shadow-primary/10"
                    : "border-border/60 bg-card/50 hover:border-primary/30"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs uppercase tracking-wide shadow-lg">
                      Most Selected
                    </Badge>
                  </div>
                )}
                <Card className="h-full border-none bg-transparent shadow-none">
                  <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center">
                      {plan.id === "standard" && <MonitorSmartphone className="h-8 w-8 text-primary" />}
                      {plan.id === "high-definition" && <Sparkles className="h-8 w-8 text-primary" />}
                      {plan.id === "custom" && <Handshake className="h-8 w-8 text-primary" />}
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription className="text-base text-foreground">
                      {plan.headline}
                    </CardDescription>
                    <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">One-time onboarding fee</div>
                    <div className="text-3xl font-bold text-primary">{plan.onboardingFee}</div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {plan.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-left">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" variant={plan.recommended ? "default" : "outline"} onClick={() => handleSelect(plan.id)}>
                      {plan.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {plan.supportsLegitScriptAddon && (
                      <label className="flex w-full items-start gap-3 rounded-lg border border-dashed border-border/70 bg-card/50 p-3 text-left text-sm">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-border accent-primary"
                          checked={legitScriptAddons[plan.id as "standard" | "high-definition"]}
                          onChange={() => toggleLegitScriptAddon(plan.id as "standard" | "high-definition")}
                        />
                        <span>
                          <span className="font-medium text-foreground">Add expedited LegitScript certification (+$5,000)</span>
                          <span className="block text-muted-foreground">
                            We shepherd the entire submission so you can sell controlled therapies as soon as your site launches.
                          </span>
                        </span>
                      </label>
                    )}

                    {plan.isCustom && (
                      <div className="w-full rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                        Includes LegitScript certification, enterprise integrations, and multi-brand support. Ideal for complex rollouts.
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ))}
          </section>
        </div>
      </div>
    </Layout>
  )
}
