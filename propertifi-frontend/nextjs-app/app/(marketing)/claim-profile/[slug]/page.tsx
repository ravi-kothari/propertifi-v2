"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    Building2,
    Mail,
    Phone,
    FileText,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Upload
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface ClaimFormData {
    businessName: string;
    yourName: string;
    title: string;
    email: string;
    phone: string;
    verificationMethod: 'email' | 'phone' | 'document';
    additionalNotes: string;
}

export default function ClaimProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const slug = params.slug as string;

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ClaimFormData>({
        businessName: '',
        yourName: '',
        title: '',
        email: '',
        phone: '',
        verificationMethod: 'email',
        additionalNotes: '',
    });

    const updateField = (field: keyof ClaimFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!formData.businessName || !formData.yourName || !formData.email) {
                toast({
                    title: "Missing Information",
                    description: "Please fill in all required fields.",
                    variant: "destructive"
                });
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "Claim Submitted!",
            description: "We'll review your claim and get back to you within 24-48 hours.",
        });

        setIsSubmitting(false);
        setCurrentStep(4); // Success step
    };

    const formatSlugToName = (slug: string) => {
        return slug.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30">
            <Section spacing="lg">
                <Container>
                    <div className="max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-amber-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Claim Your Profile
                            </h1>
                            <p className="text-slate-600">
                                Verify ownership of <strong>{formatSlugToName(slug)}</strong> to manage your listing
                            </p>
                        </div>

                        {/* Progress Steps */}
                        {currentStep < 4 && (
                            <div className="flex items-center justify-center mb-8">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step <= currentStep
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {step < currentStep ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`w-16 h-1 ${step < currentStep ? 'bg-amber-500' : 'bg-slate-200'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 1: Business Information */}
                        {currentStep === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-amber-500" />
                                        Business Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="businessName">Business Name *</Label>
                                        <Input
                                            id="businessName"
                                            value={formData.businessName}
                                            onChange={(e) => updateField('businessName', e.target.value)}
                                            placeholder={formatSlugToName(slug)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="yourName">Your Full Name *</Label>
                                            <Input
                                                id="yourName"
                                                value={formData.yourName}
                                                onChange={(e) => updateField('yourName', e.target.value)}
                                                placeholder="John Smith"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="title">Your Title</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => updateField('title', e.target.value)}
                                                placeholder="Owner, Manager, etc."
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Business Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="you@company.com"
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Use an email matching your company domain for faster verification
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Business Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="(555) 123-4567"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={handleNext} className="bg-amber-500 hover:bg-amber-600">
                                            Continue <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Verification Method */}
                        {currentStep === 2 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                                        Choose Verification Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-slate-600 text-sm mb-4">
                                        Select how you'd like to verify ownership of this business profile.
                                    </p>

                                    <div className="space-y-3">
                                        {[
                                            {
                                                method: 'email',
                                                icon: Mail,
                                                title: 'Email Verification',
                                                description: 'We\'ll send a verification link to your business email',
                                                recommended: true
                                            },
                                            {
                                                method: 'phone',
                                                icon: Phone,
                                                title: 'Phone Verification',
                                                description: 'Receive a verification code via SMS or call'
                                            },
                                            {
                                                method: 'document',
                                                icon: FileText,
                                                title: 'Document Upload',
                                                description: 'Upload a business license or official document'
                                            }
                                        ].map((option) => (
                                            <button
                                                key={option.method}
                                                type="button"
                                                onClick={() => updateField('verificationMethod', option.method)}
                                                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${formData.verificationMethod === option.method
                                                        ? 'border-amber-500 bg-amber-50'
                                                        : 'border-slate-200 hover:border-amber-300'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.verificationMethod === option.method
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        <option.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-slate-900">
                                                                {option.title}
                                                            </span>
                                                            {option.recommended && (
                                                                <Badge className="bg-green-100 text-green-700 text-xs">
                                                                    Recommended
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-4 flex justify-between">
                                        <Button variant="outline" onClick={handleBack}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button onClick={handleNext} className="bg-amber-500 hover:bg-amber-600">
                                            Continue <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Review & Submit */}
                        {currentStep === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-amber-500" />
                                        Review & Submit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Business:</span>
                                            <span className="font-semibold">{formData.businessName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Your Name:</span>
                                            <span className="font-semibold">{formData.yourName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Email:</span>
                                            <span className="font-semibold">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Verification:</span>
                                            <Badge className="bg-amber-100 text-amber-700">
                                                {formData.verificationMethod === 'email' ? 'Email' :
                                                    formData.verificationMethod === 'phone' ? 'Phone' : 'Document'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                        <textarea
                                            id="notes"
                                            value={formData.additionalNotes}
                                            onChange={(e) => updateField('additionalNotes', e.target.value)}
                                            placeholder="Any additional information to help verify your claim..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mt-1"
                                        />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• We'll verify your identity using your chosen method</li>
                                            <li>• Verification typically takes 24-48 hours</li>
                                            <li>• Once verified, you can edit your profile and receive leads</li>
                                        </ul>
                                    </div>

                                    <div className="pt-4 flex justify-between">
                                        <Button variant="outline" onClick={handleBack}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="bg-amber-500 hover:bg-amber-600"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>Submit Claim</>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 4: Success */}
                        {currentStep === 4 && (
                            <Card className="text-center">
                                <CardContent className="pt-8 pb-8">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        Claim Submitted Successfully!
                                    </h2>
                                    <p className="text-slate-600 mb-6">
                                        We've received your claim for <strong>{formData.businessName}</strong>.
                                        You'll receive a verification email at <strong>{formData.email}</strong> shortly.
                                    </p>
                                    <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                                        <h4 className="font-semibold text-slate-900 mb-2">Next Steps:</h4>
                                        <ul className="text-sm text-slate-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                                                Check your email for the verification link
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-slate-300 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                                                Complete verification within 48 hours
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-slate-300 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                                                Access your dashboard to manage your profile
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <Link href={`/property-managers`}>
                                            <Button variant="outline">
                                                Back to Directory
                                            </Button>
                                        </Link>
                                        <Link href="/login?type=manager">
                                            <Button className="bg-amber-500 hover:bg-amber-600">
                                                Go to Manager Login
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits Section */}
                        {currentStep < 4 && (
                            <div className="mt-8 text-center">
                                <h3 className="text-sm font-semibold text-slate-500 mb-4">
                                    BENEFITS OF CLAIMING YOUR PROFILE
                                </h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                        <span className="text-slate-700">Verified Badge</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <Mail className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                        <span className="text-slate-700">Lead Notifications</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <FileText className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                                        <span className="text-slate-700">Edit Profile</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </Section>
        </main>
    );
}
