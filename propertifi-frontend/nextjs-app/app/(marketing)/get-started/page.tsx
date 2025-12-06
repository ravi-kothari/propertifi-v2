'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AddressAutocomplete } from '@/components/forms/AddressAutocomplete';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface FormData {
  // Property details
  property_type: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  number_of_units: string;
  square_footage: string;
  additional_services: string[];

  // Contact information
  full_name: string;
  email: string;
  phone: string;
  preferred_contact: string;
}

const PROPERTY_TYPES = [
  { value: 'single-family', label: 'Single Family Home', icon: '🏠' },
  { value: 'multi-family', label: 'Multi-Family Property', icon: '🏘️' },
  { value: 'hoa-coa', label: 'HOA/COA', icon: '🏛️' },
  { value: 'commercial', label: 'Commercial Property', icon: '🏢' },
];

const ADDITIONAL_SERVICES = [
  'Tenant Screening',
  'Rent Collection',
  'Maintenance Coordination',
  'Legal Compliance',
  'Financial Reporting',
  'Marketing & Leasing',
];

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export default function GetStartedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    property_type: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: searchParams.get('zipcode') || '',
    number_of_units: '',
    square_footage: '',
    additional_services: [],
    full_name: '',
    email: '',
    phone: '',
    preferred_contact: 'email',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.property_type) newErrors.property_type = 'Please select a property type';
    }

    if (step === 2) {
      if (!formData.street_address) newErrors.street_address = 'Street address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip_code) {
        newErrors.zip_code = 'ZIP code is required';
      } else if (!/^\d{5}$/.test(formData.zip_code)) {
        newErrors.zip_code = 'ZIP code must be 5 digits';
      }
    }

    if (step === 3) {
      if (!formData.full_name) newErrors.full_name = 'Full name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      // Phone is now optional - only validate format if provided
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
      if (!formData.preferred_contact) newErrors.preferred_contact = 'Please select a contact method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        property_type: formData.property_type,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        number_of_units: formData.number_of_units ? parseInt(formData.number_of_units) : undefined,
        square_footage: formData.square_footage ? parseInt(formData.square_footage) : undefined,
        additional_services: formData.additional_services.length > 0 ? formData.additional_services : undefined,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        preferred_contact: formData.preferred_contact,
        source: 'landing-page',
      };

      const response = await apiClient.post('/home-page-lead', payload);

      if (response.data.success) {
        // Redirect to success page with confirmation number and email for account creation
        router.push(`/get-started/success?confirmation=${response.data.data.confirmation_number}&matches=${response.data.data.matched_managers_count}&email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: any) {
      console.error('Lead submission error:', error);
      setSubmitError(
        error.response?.data?.message ||
        'Failed to submit your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      additional_services: prev.additional_services.includes(service)
        ? prev.additional_services.filter(s => s !== service)
        : [...prev.additional_services, service]
    }));
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Get Started with Propertifi
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect property manager in minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-propertifi-orange to-propertifi-blue h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Property Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    What type of property do you have?
                  </h2>
                  <InfoTooltip content="Selecting your property type helps us match you with property managers who specialize in managing properties like yours." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateFormData('property_type', type.value)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.property_type === type.value
                          ? 'border-propertifi-orange bg-propertifi-orange/10'
                          : 'border-gray-200 hover:border-propertifi-orange/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{type.icon}</div>
                      <div className="font-semibold text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
                {errors.property_type && (
                  <p className="mt-2 text-sm text-red-600">{errors.property_type}</p>
                )}
              </motion.div>
            )}

            {/* Step 2: Property Location & Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Where is your property located?
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <AddressAutocomplete
                      onSelect={(addressData) => {
                        // Update all address fields at once
                        setFormData(prev => ({
                          ...prev,
                          street_address: addressData.street_address,
                          city: addressData.city,
                          state: addressData.state,
                          zip_code: addressData.zip_code,
                        }));
                        // Clear any address-related errors
                        setErrors(prev => ({
                          ...prev,
                          street_address: '',
                          city: '',
                          state: '',
                          zip_code: '',
                        }));
                      }}
                      defaultValue={formData.street_address}
                      placeholder="Start typing your address..."
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                        errors.street_address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      error={errors.street_address}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="San Francisco"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select State</option>
                        {US_STATES.map(state => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => updateFormData('zip_code', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                          errors.zip_code ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="94102"
                        maxLength={5}
                      />
                      {errors.zip_code && (
                        <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Number of Units (Optional)
                        <InfoTooltip content="For single-family homes, enter 1. For duplexes, enter 2. For apartment buildings, enter the total number of units." />
                      </label>
                      <input
                        type="number"
                        value={formData.number_of_units}
                        onChange={(e) => updateFormData('number_of_units', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      Square Footage (Optional)
                      <InfoTooltip content="An approximate value is fine. This helps us match you with property managers experienced with properties of your size." />
                    </label>
                    <input
                      type="number"
                      value={formData.square_footage}
                      onChange={(e) => updateFormData('square_footage', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange"
                      placeholder="1500"
                      min="1"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How can we contact you?
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => updateFormData('full_name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-propertifi-orange ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      We'll never sell your information
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      Preferred Contact Method *
                      <InfoTooltip content="Choose how you'd like property managers to reach you with quotes and availability information." />
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => updateFormData('preferred_contact', 'email')}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          formData.preferred_contact === 'email'
                            ? 'border-propertifi-orange bg-propertifi-orange/10'
                            : 'border-gray-200 hover:border-propertifi-orange/50'
                        }`}
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData('preferred_contact', 'phone')}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          formData.preferred_contact === 'phone'
                            ? 'border-propertifi-orange bg-propertifi-orange/10'
                            : 'border-gray-200 hover:border-propertifi-orange/50'
                        }`}
                      >
                        Phone
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Additional Services */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    What services are you looking for?
                  </h2>
                  <InfoTooltip content="Selecting specific services helps us match you with property managers who specialize in what you need. This improves the quality of quotes you receive." />
                </div>
                <p className="text-gray-600 mb-6">
                  Select all that apply (optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADDITIONAL_SERVICES.map(service => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.additional_services.includes(service)
                          ? 'border-propertifi-orange bg-propertifi-orange/10'
                          : 'border-gray-200 hover:border-propertifi-orange/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                          formData.additional_services.includes(service)
                            ? 'border-propertifi-orange bg-propertifi-orange'
                            : 'border-gray-300'
                        }`}>
                          {formData.additional_services.includes(service) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{service}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {submitError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'invisible'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Get Matched'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
