import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  Star, 
  Check, 
  AlertCircle,
  Crown,
  Zap,
  Building
} from 'lucide-react'
import Layout from '@/components/Layout'

interface PlanFeatures {
  maxProducts: number
  maxCampaigns: number
  analyticsAccess: boolean
  customerSupport: string
  customBranding: boolean
  apiAccess?: boolean
  whiteLabel?: boolean
  customIntegrations?: boolean
}

interface Plan {
  name: string
  price: number
  features: PlanFeatures
  stripePriceId: string
}

interface Plans {
  starter: Plan
  professional: Plan
  enterprise: Plan
}

interface Subscription {
  id: string
  planType: string
  status: string
  monthlyPrice: number
  currentPeriodStart?: string
  currentPeriodEnd?: string
  daysUntilRenewal: number
  isActive: boolean
  isTrialing: boolean
  planDetails: Plan
}

export default function Plans() {
  const [plans, setPlans] = useState<Plans | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creatingCheckout, setCreatingCheckout] = useState<string | null>(null)
  const { user, token } = useAuth()
  const router = useRouter()

  // Handle success/cancel parameters
  useEffect(() => {
    const { success, canceled, session_id } = router.query
    
    if (success === 'true') {
      setError(null)
      // Show success message or redirect
      setTimeout(() => {
        router.replace('/plans', undefined, { shallow: true })
      }, 3000)
    }
    
    if (canceled === 'true') {
      setError('Payment was canceled. You can try again anytime.')
      setTimeout(() => {
        router.replace('/plans', undefined, { shallow: true })
      }, 3000)
    }
  }, [router.query])

  // Fetch plans and current subscription
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setLoading(true)
        
        // Fetch available plans
        const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/brand-subscriptions/plans`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (plansResponse.ok) {
          const plansData = await plansResponse.json()
          setPlans(plansData.plans)
        }

        // Fetch current subscription
        const subResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/brand-subscriptions/current`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (subResponse.ok) {
          const subData = await subResponse.json()
          if (subData.success && subData.subscription) {
            setCurrentSubscription(subData.subscription)
          }
        } else if (subResponse.status !== 404) {
          console.error('Failed to fetch subscription')
        }

      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load subscription data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleSelectPlan = async (planType: string) => {
    if (!token) return

    setCreatingCheckout(planType)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/brand-subscriptions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planType,
          successUrl: `${window.location.origin}/plans?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/plans?canceled=true`
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        setError(data.message || 'Failed to create checkout session')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setCreatingCheckout(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!token || !currentSubscription) return

    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/brand-subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Refresh the page to update subscription status
        window.location.reload()
      } else {
        setError(data.message || 'Failed to cancel subscription')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'starter':
        return <Zap className="h-6 w-6" />
      case 'professional':
        return <Star className="h-6 w-6" />
      case 'enterprise':
        return <Crown className="h-6 w-6" />
      default:
        return <Building className="h-6 w-6" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300"><Clock className="h-3 w-3 mr-1" /> Processing</Badge>
      case 'payment_due':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><AlertCircle className="h-3 w-3 mr-1" /> Payment Due</Badge>
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="h-3 w-3 mr-1" /> Past Due</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription plans...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Subscription Plans - Fuse</title>
        <meta name="description" content="Choose your brand subscription plan" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Brand Partner Plans</h1>
            <p className="text-muted-foreground text-lg">Choose the perfect plan for your brand's needs</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {router.query.success === 'true' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">Subscription created successfully! Welcome to Fuse Brand Partners.</p>
              </div>
            </div>
          )}

          {/* Current Subscription */}
          {currentSubscription && (
            <Card className="mb-8 border-primary">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Current Subscription
                    </CardTitle>
                  </div>
                  {getStatusBadge(currentSubscription.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {getPlanIcon(currentSubscription.planType)}
                      {currentSubscription.planDetails?.name} Plan
                    </h3>
                    <p className="text-2xl font-bold text-primary">${currentSubscription.monthlyPrice}/month</p>
                  </div>
                  
                  {currentSubscription.isActive && (
                    <div>
                      <p className="text-sm text-muted-foreground">Next billing date</p>
                      <p className="font-medium">
                        {new Date(currentSubscription.currentPeriodEnd!).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({currentSubscription.daysUntilRenewal} days remaining)
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    {(currentSubscription.status === 'active' || currentSubscription.status === 'past_due') && (
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelSubscription}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plans Grid */}
          {plans && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([planType, plan]) => (
                <Card 
                  key={planType} 
                  className={`relative ${planType === 'professional' ? 'border-primary ring-2 ring-primary ring-opacity-20' : ''}`}
                >
                  {planType === 'professional' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      {getPlanIcon(planType)}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-primary">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {plan.features.maxProducts === -1 ? 'Unlimited products' : `Up to ${plan.features.maxProducts} products`}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {plan.features.maxCampaigns === -1 ? 'Unlimited campaigns' : `Up to ${plan.features.maxCampaigns} campaigns`}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {plan.features.customerSupport} support
                      </li>
                      {plan.features.customBranding && (
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          Custom branding
                        </li>
                      )}
                      {plan.features.apiAccess && (
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          API access
                        </li>
                      )}
                      {plan.features.whiteLabel && (
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          White-label solution
                        </li>
                      )}
                      {plan.features.customIntegrations && (
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          Custom integrations
                        </li>
                      )}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      variant={planType === 'professional' ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(planType)}
                      disabled={
                        !!creatingCheckout || 
                        (currentSubscription?.planType === planType && currentSubscription?.isActive)
                      }
                    >
                      {creatingCheckout === planType ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : currentSubscription?.planType === planType && currentSubscription?.isActive ? (
                        'Current Plan'
                      ) : (
                        'Choose Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Features Comparison */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Starter</th>
                        <th className="text-center p-4 font-semibold">Professional</th>
                        <th className="text-center p-4 font-semibold">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium">Products</td>
                        <td className="p-4 text-center">50</td>
                        <td className="p-4 text-center">200</td>
                        <td className="p-4 text-center">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Campaigns</td>
                        <td className="p-4 text-center">5</td>
                        <td className="p-4 text-center">20</td>
                        <td className="p-4 text-center">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Analytics Access</td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Customer Support</td>
                        <td className="p-4 text-center">Email</td>
                        <td className="p-4 text-center">Priority</td>
                        <td className="p-4 text-center">Dedicated</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Custom Branding</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">API Access</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">White-label Solution</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}