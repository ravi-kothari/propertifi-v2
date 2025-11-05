"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormProgress } from "@/app/components/FormProgress";
import { GetStartedFormProvider, useGetStartedForm } from "@/app/contexts/GetStartedFormContext";
import { useToast } from "@/hooks/use-toast";
import { Edit, MapPin, Building2, User, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { submitLead, transformFormDataToApiFormat, ValidationError, ApiClientError } from "@/lib/api-client";

const STEPS = ["Property Type", "Address", "Details", "Contact", "Review"];

const PROPERTY_TYPE_LABELS: { [key: string]: string } = {
  "single-family": "Single Family",
  "multi-family": "Multi-Family",
  "hoa-coa": "HOA/COA",
  commercial: "Commercial",
};

const SERVICE_LABELS: { [key: string]: string } = {
  "tenant-screening": "Tenant Screening",
  "rent-collection": "Rent Collection",
  maintenance: "Maintenance & Repairs",
  "financial-reporting": "Financial Reporting",
  "legal-compliance": "Legal Compliance",
  marketing: "Marketing & Leasing",
  "eviction-services": "Eviction Services",
  inspections: "Property Inspections",
};

function ReviewAndSubmitContent() {
  const { formData, resetForm, setCurrentStep } = useGetStartedForm();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if no property type selected
    if (!formData.propertyType) {
      router.push("/get-started");
    }
  }, [formData.propertyType, router]);

  const handleEdit = (step: number, path: string) => {
    setCurrentStep(step);
    router.push(path);
  };

  const handleBack = () => {
    setCurrentStep(4);
    router.push("/get-started/contact");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.propertyType || !formData.streetAddress || !formData.city ||
          !formData.state || !formData.zipCode || !formData.fullName ||
          !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please complete all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Transform form data to API format
      const apiData = transformFormDataToApiFormat(formData as any);

      // Submit to Laravel backend
      const response = await submitLead(apiData);

      console.log("Lead submitted successfully:", response);

      // Show success message
      toast({
        title: "Success!",
        description: response.message || "Your request has been submitted successfully. We'll match you with the best property managers in your area.",
      });

      // Clear form data and localStorage
      resetForm();

      // Redirect to thank you page
      router.push("/thank-you");
    } catch (error) {
      console.error("Submission error:", error);

      // Handle validation errors
      if (error instanceof ValidationError) {
        const firstError = Object.values(error.errors || {})[0]?.[0];

        toast({
          variant: "destructive",
          title: "Validation Error",
          description: firstError || "Please check your information and try again.",
        });

        // Optionally, you could navigate back to the step with the error
        // For now, we'll just show the error and keep them on the review page
      }
      // Handle API errors
      else if (error instanceof ApiClientError) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: error.message || "There was a problem submitting your request. Please try again.",
        });
      }
      // Handle network/unknown errors
      else {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
        });
      }

      setIsSubmitting(false);
    }
  };

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <FormProgress currentStep={5} totalSteps={5} steps={STEPS} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Review Your Information
            </h1>
            <p className="text-lg text-slate-600">
              Please review your information before submitting
            </p>
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {/* Property Type */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  Property Type
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(1, "/get-started")}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="text-base px-4 py-2">
                  {formData.propertyType && PROPERTY_TYPE_LABELS[formData.propertyType]}
                </Badge>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  Property Address
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(2, "/get-started/address")}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-slate-700">
                  <div>{formData.streetAddress}</div>
                  <div>
                    {formData.city}, {formData.state} {formData.zipCode}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  Property Details
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(3, "/get-started/details")}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Size */}
                <div className="grid grid-cols-2 gap-4">
                  {formData.numberOfUnits && (
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Number of Units</div>
                      <div className="font-semibold text-slate-900">
                        {formData.numberOfUnits}
                      </div>
                    </div>
                  )}
                  {formData.squareFootage && (
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Square Footage</div>
                      <div className="font-semibold text-slate-900">
                        {formData.squareFootage.toLocaleString()} sq ft
                      </div>
                    </div>
                  )}
                </div>

                {/* Services */}
                {formData.additionalServices && formData.additionalServices.length > 0 && (
                  <div>
                    <div className="text-sm text-slate-500 mb-2">Services Needed</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.additionalServices.map((serviceId) => (
                        <Badge key={serviceId} variant="default">
                          {SERVICE_LABELS[serviceId]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Contact Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(4, "/get-started/contact")}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{formData.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{formData.phone}</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-slate-500 mb-1">Preferred Contact Method</div>
                  <Badge variant="default">
                    {formData.preferredContact === "email" ? "Email" : "Phone"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-slate-600 text-center">
              By submitting this form, you agree to be contacted by property managers that match
              your requirements. Your information will be kept confidential and secure.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function ReviewAndSubmitPage() {
  return (
    <GetStartedFormProvider>
      <main className="min-h-screen bg-slate-50 py-12">
        <ReviewAndSubmitContent />
      </main>
    </GetStartedFormProvider>
  );
}
