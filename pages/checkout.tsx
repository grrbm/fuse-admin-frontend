import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Check,
  CreditCard,
  Shield,
  Lock,
  Clock,
  Building2,
  Sparkles,
  Settings
} from 'lucide-react'
import Layout from '@/components/Layout'

interface CheckoutData {
  planType: string
  planName: string
  planPrice: number
  onboardingType: string
  onboardingName: string
  onboardingPrice: number
  totalAmount: number
}

const onboardingIcons = {
  standard: Building2,
  'high-definition': Sparkles,
  custom: Settings
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Get checkout data from query params
    const { 
      planType, 
      planName, 
      planPrice, 
      onboardingType, 
      onboardingName, 
      onboardingPrice 
    } = router.query

    if (planType && planName && planPrice && onboardingType && onboardingName && onboardingPrice) {
      const planPriceNum = parseInt(planPrice as string)
      const onboardingPriceNum = parseInt(onboardingPrice as string)
      
      setCheckoutData({
        planType: planType as string,
        planName: planName as string,
        planPrice: planPriceNum,
        onboardingType: onboardingType as string,
        onboardingName: onboardingName as string,
        onboardingPrice: onboardingPriceNum,
        totalAmount: planPriceNum + onboardingPriceNum
      })
    } else {
      // Redirect back if missing data
      router.push('/plans')
    }
  }, [router.query])

  const handleCompleteCheckout = async () => {
    if (!checkoutData || !user) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planType: checkoutData.planType,
          onboardingType: checkoutData.onboardingType,
          totalAmount: checkoutData.totalAmount,
          items: [
            {
              name: checkoutData.planName,
              price: checkoutData.planPrice,
              quantity: 1,
              type: 'subscription'
            },
            {
              name: checkoutData.onboardingName,
              price: checkoutData.onboardingPrice,
              quantity: 1,
              type: 'onetime'
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { checkoutUrl } = await response.json()
      window.location.href = checkoutUrl

    } catch (error) {
      console.error('Checkout error:', error)
      // Handle error - show toast or error message
    } finally {
      setIsProcessing(false)
    }
  }

  if (!checkoutData) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const OnboardingIcon = onboardingIcons[checkoutData.onboardingType as keyof typeof onboardingIcons] || Building2

  return (
    <Layout>
      <Head>
        <title>Checkout - Fuse Health</title>
        <meta name="description" content="Complete your Fuse Health setup" />
      </Head>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Secure checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Platform Plan */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{checkoutData.planName} Plan</h3>
                      <p className="text-sm text-muted-foreground">Monthly subscription</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${checkoutData.planPrice.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">/month</div>
                    </div>
                  </div>

                  {/* Onboarding Package */}
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <OnboardingIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{checkoutData.onboardingName}</h3>
                      <p className="text-sm text-muted-foreground">One-time onboarding fee</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${checkoutData.onboardingPrice.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">one-time</div>
                    </div>
                  </div>

                  <div className="border-t border-border"></div>

                  {/* Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly subscription</span>
                      <span>${checkoutData.planPrice.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Onboarding setup</span>
                      <span>${checkoutData.onboardingPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Due today</span>
                      <span>${checkoutData.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2 mt-3">
                      <p className="text-xs text-muted-foreground">
                        Includes first month + onboarding setup
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Month 1 billing begins when your site is live • 1% transaction fee applies to patient orders
                      </p>
                    </div>
                  </div>

                  {/* Security & Features */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>No commitment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Complete your setup
                  </h1>
                  <p className="text-muted-foreground">
                    You're one step away from launching your telehealth practice
                  </p>
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    What happens after payment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm">Immediate access to your admin dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm">Onboarding call scheduled within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm">Platform configured and launched in 1-2 weeks</span>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">HIPAA Compliant</div>
                    <div className="text-xs text-muted-foreground">Enterprise security</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">Secure Payment</div>
                    <div className="text-xs text-muted-foreground">256-bit SSL encryption</div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleCompleteCheckout}
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Setup - ${checkoutData.totalAmount.toLocaleString()}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our terms of service and privacy policy.
                  Your subscription will auto-renew monthly and can be cancelled anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
