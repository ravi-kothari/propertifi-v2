'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    User,
    Building2,
    FileText,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    Clock,
    Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
    // Step 1: Account
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;

    // Step 2: Business
    companyName: string;
    businessAddress: string;
    city: string;
    state: string;
    zipCode: string;
    website: string;
    yearsInBusiness: string;

    // Step 3: Services & Fees
    propertyTypes: string[];
    rentalsManaged: string;
    managementFee: string;
    tenantPlacementFee: string;
    description: string;
}

const PROPERTY_TYPES = [
    'Single Family Homes',
    'Multi-Family (2-4 units)',
    'Apartments (5+ units)',
    'Condominiums',
    'Townhomes',
    'Commercial Properties',
    'Vacation Rentals',
    'HOA Management'
];

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

export default function PMRegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        businessAddress: '',
        city: '',
        state: '',
        zipCode: '',
        website: '',
        yearsInBusiness: '',
        propertyTypes: [],
        rentalsManaged: '',
        managementFee: '',
        tenantPlacementFee: '',
        description: '',
    });

    const updateField = (field: keyof FormData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const togglePropertyType = (type: string) => {
        const current = formData.propertyTypes;
        if (current.includes(type)) {
            updateField('propertyTypes', current.filter(t => t !== type));
        } else {
            updateField('propertyTypes', [...current, type]);
        }
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                    toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
                    return false;
                }
                if (formData.password.length < 8) {
                    toast({ title: "Weak Password", description: "Password must be at least 8 characters.", variant: "destructive" });
                    return false;
                }
                return true;
            case 2:
                if (!formData.companyName || !formData.city || !formData.state) {
                    toast({ title: "Missing Information", description: "Please fill in company name and location.", variant: "destructive" });
                    return false;
                }
                return true;
            case 3:
                if (formData.propertyTypes.length === 0) {
                    toast({ title: "Missing Information", description: "Please select at least one property type.", variant: "destructive" });
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "Application Submitted!",
            description: "We'll verify your information and contact you within 1-2 business days.",
        });

        setIsSubmitting(false);
        setCurrentStep(5); // Success step
    };

    const steps = [
        { number: 1, title: 'Account', icon: User },
        { number: 2, title: 'Business', icon: Building2 },
        { number: 3, title: 'Services', icon: FileText },
        { number: 4, title: 'Review', icon: CheckCircle2 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50/30 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/home" className="inline-flex items-center space-x-2 mb-6">
                        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#3B82F6" />
                            <path d="M16 10L2 17L16 24L30 17L16 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-extrabold text-2xl text-gray-900">PROPERTIFI</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Join as a Property Manager
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Get verified and start receiving quality leads
                    </p>
                </div>

                {/* Progress Steps */}
                {currentStep < 5 && (
                    <div className="flex justify-center mb-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${step.number < currentStep
                                        ? 'bg-green-500 text-white'
                                        : step.number === currentStep
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {step.number < currentStep ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`ml-2 text-sm font-medium hidden sm:block ${step.number === currentStep ? 'text-orange-600' : 'text-gray-500'
                                    }`}>
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Account Information */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-orange-500" />
                                    Create Your Account
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                placeholder="John"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                placeholder="Smith"
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
                                            placeholder="john@yourcompany.com"
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Use your company email for faster verification</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="(555) 123-4567"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                                            placeholder="Re-enter password"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Business Information */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-orange-500" />
                                    Business Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="companyName">Company Name *</Label>
                                        <Input
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={(e) => updateField('companyName', e.target.value)}
                                            placeholder="ABC Property Management"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="businessAddress">Business Address</Label>
                                        <Input
                                            id="businessAddress"
                                            value={formData.businessAddress}
                                            onChange={(e) => updateField('businessAddress', e.target.value)}
                                            placeholder="123 Main Street"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e) => updateField('city', e.target.value)}
                                                placeholder="Los Angeles"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State *</Label>
                                            <select
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) => updateField('state', e.target.value)}
                                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="">Select</option>
                                                {US_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="zipCode">ZIP Code</Label>
                                            <Input
                                                id="zipCode"
                                                value={formData.zipCode}
                                                onChange={(e) => updateField('zipCode', e.target.value)}
                                                placeholder="90001"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={formData.website}
                                            onChange={(e) => updateField('website', e.target.value)}
                                            placeholder="https://yourcompany.com"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="yearsInBusiness">Years in Business</Label>
                                        <select
                                            id="yearsInBusiness"
                                            value={formData.yearsInBusiness}
                                            onChange={(e) => updateField('yearsInBusiness', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="0-1">Less than 1 year</option>
                                            <option value="1-3">1-3 years</option>
                                            <option value="3-5">3-5 years</option>
                                            <option value="5-10">5-10 years</option>
                                            <option value="10+">10+ years</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button variant="outline" onClick={handleBack}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </Button>
                                    <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Services & Fees */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-500" />
                                    Services & Fees
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <Label className="block mb-3">Property Types Managed *</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {PROPERTY_TYPES.map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => togglePropertyType(type)}
                                                    className={`px-3 py-2 text-sm rounded-lg border text-left transition-all ${formData.propertyTypes.includes(type)
                                                            ? 'bg-orange-100 border-orange-500 text-orange-700'
                                                            : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="rentalsManaged">Number of Rentals Managed</Label>
                                        <select
                                            id="rentalsManaged"
                                            value={formData.rentalsManaged}
                                            onChange={(e) => updateField('rentalsManaged', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="1-10">1-10</option>
                                            <option value="11-50">11-50</option>
                                            <option value="51-100">51-100</option>
                                            <option value="101-500">101-500</option>
                                            <option value="500+">500+</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="managementFee">Management Fee</Label>
                                            <Input
                                                id="managementFee"
                                                value={formData.managementFee}
                                                onChange={(e) => updateField('managementFee', e.target.value)}
                                                placeholder="e.g., 8% or $150/month"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="tenantPlacementFee">Tenant Placement Fee</Label>
                                            <Input
                                                id="tenantPlacementFee"
                                                value={formData.tenantPlacementFee}
                                                onChange={(e) => updateField('tenantPlacementFee', e.target.value)}
                                                placeholder="e.g., 50% first month"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Company Description</Label>
                                        <textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            placeholder="Tell property owners what makes your company great..."
                                            rows={4}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button variant="outline" onClick={handleBack}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </Button>
                                    <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                                        Review Application <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                    Review Your Application
                                </h2>

                                <div className="space-y-6">
                                    {/* Account Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Account Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</div>
                                            <div><span className="text-gray-500">Email:</span> {formData.email}</div>
                                            <div><span className="text-gray-500">Phone:</span> {formData.phone || 'Not provided'}</div>
                                        </div>
                                    </div>

                                    {/* Business Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" /> Business Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><span className="text-gray-500">Company:</span> {formData.companyName}</div>
                                            <div><span className="text-gray-500">Location:</span> {formData.city}, {formData.state}</div>
                                            <div><span className="text-gray-500">Website:</span> {formData.website || 'Not provided'}</div>
                                            <div><span className="text-gray-500">Years:</span> {formData.yearsInBusiness || 'Not provided'}</div>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Services
                                        </h3>
                                        <div className="text-sm">
                                            <div className="mb-2">
                                                <span className="text-gray-500">Property Types:</span>{' '}
                                                {formData.propertyTypes.join(', ')}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><span className="text-gray-500">Rentals Managed:</span> {formData.rentalsManaged || 'N/A'}</div>
                                                <div><span className="text-gray-500">Management Fee:</span> {formData.managementFee || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <Shield className="w-4 h-4" /> Verification Process
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• We'll review your application within 1-2 business days</li>
                                            <li>• A team member may contact you to verify your business</li>
                                            <li>• Once verified, your profile will go live and you'll start receiving leads</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button variant="outline" onClick={handleBack}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>Submit Application</>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Success */}
                        {currentStep === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Application Submitted!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Thanks for applying to join Propertifi, {formData.firstName}!
                                </p>

                                <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                            <div>
                                                <div className="font-medium text-gray-900">Application Review</div>
                                                <div className="text-sm text-gray-600">Our team reviews your submission (1-2 business days)</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                            <div>
                                                <div className="font-medium text-gray-900">Verification Call</div>
                                                <div className="text-sm text-gray-600">We may contact you to verify your business</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                                            <div>
                                                <div className="font-medium text-gray-900">Profile Activation</div>
                                                <div className="text-sm text-gray-600">Once verified, you'll start receiving leads!</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-6">
                                    We've sent a confirmation email to <strong>{formData.email}</strong>
                                </p>

                                <Link href="/home">
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                        Back to Home
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login?type=manager" className="text-orange-600 font-medium hover:text-orange-500">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
