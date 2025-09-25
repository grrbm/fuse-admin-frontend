import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Layout from '@/components/Layout'
import {
    ArrowLeft,
    Save,
    X,
    Loader2,
    CheckCircle,
    XCircle
} from 'lucide-react'

interface Treatment {
    id: string
    name: string
    treatmentLogo?: string
    productsPrice: number
    active: boolean
    stripeProductId?: string
    createdAt: string
    updatedAt: string
}

export default function TreatmentEdit() {
    const [treatment, setTreatment] = useState<Treatment | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        active: true
    })
    const { user, token } = useAuth()
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        const fetchTreatment = async () => {
            if (!token || !id) return

            try {
                setLoading(true)
                console.log('🔍 Fetching treatment for edit:', id)

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/treatments/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.success) {
                        const treatmentData = data.data
                        setTreatment(treatmentData)
                        setFormData({
                            name: treatmentData.name,
                            active: treatmentData.active
                        })
                    } else {
                        setError(data.message || 'Failed to load treatment')
                    }
                } else {
                    setError(`Failed to load treatment: ${response.status} ${response.statusText}`)
                }
            } catch (err) {
                console.error('Error fetching treatment:', err)
                setError('Failed to load treatment')
            } finally {
                setLoading(false)
            }
        }

        fetchTreatment()
    }, [token, id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!treatment || !token) return

        setSaving(true)
        setError(null)

        try {
            console.log('🔍 Saving treatment:', treatment.id)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/treatments`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    treatmentId: treatment.id,
                    name: formData.name,
                    active: formData.active
                })
            })

            if (response.ok) {
                const data = await response.json()
                if (data.success) {
                    console.log('✅ Treatment updated successfully')
                    router.push(`/treatments/${treatment.id}`)
                } else {
                    setError(data.message || 'Failed to update treatment')
                }
            } else {
                const errorText = await response.text()
                setError(`Failed to update treatment: ${response.status} ${response.statusText}`)
            }
        } catch (err) {
            console.error('Error updating treatment:', err)
            setError('Failed to update treatment')
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleStatusChange = (active: boolean) => {
        setFormData(prev => ({
            ...prev,
            active
        }))
    }

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading treatment...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!treatment) {
        return (
            <Layout>
                <div className="min-h-screen bg-background p-6">
                    <div className="max-w-4xl mx-auto">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/treatments')}
                            className="mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Treatments
                        </Button>

                        <Card className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <XCircle className="h-12 w-12 text-red-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Treatment Not Found</h3>
                                    <p className="text-muted-foreground mb-4">{error || 'The requested treatment could not be found.'}</p>
                                    <Button onClick={() => router.push('/treatments')}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Treatments
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>Edit {treatment.name} - Fuse Admin</title>
                <meta name="description" content={`Edit treatment ${treatment.name}`} />
            </Head>

            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/treatments/${treatment.id}`)}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Treatment
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Edit Treatment</h1>
                                <p className="text-muted-foreground">Modify treatment details and settings</p>
                            </div>
                        </div>
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

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Treatment Name */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                                    Treatment Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="Enter treatment name"
                                                    required
                                                />
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Status
                                                </label>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(true)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${formData.active
                                                                ? 'bg-green-100 border-green-300 text-green-800'
                                                                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        Active
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusChange(false)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${!formData.active
                                                                ? 'bg-red-100 border-red-300 text-red-800'
                                                                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Inactive
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Current Treatment Info (Read-only) */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Current Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Products Value:</span>
                                                <p className="font-semibold">${treatment.productsPrice.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Created:</span>
                                                <p className="font-semibold">
                                                    {new Date(treatment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Last Updated:</span>
                                                <p className="font-semibold">
                                                    {new Date(treatment.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Stripe Product ID:</span>
                                                <p className="font-semibold text-xs">
                                                    {treatment.stripeProductId || 'Not set'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Save Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Save Changes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Treatment
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => router.push(`/treatments/${treatment.id}`)}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Treatment Logo */}
                                {treatment.treatmentLogo && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Current Logo</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <img
                                                    src={treatment.treatmentLogo}
                                                    alt={treatment.name}
                                                    className="w-full max-w-xs mx-auto h-32 object-cover rounded-lg border"
                                                />
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Logo will remain unchanged
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
