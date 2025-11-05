"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormProgress } from "@/app/components/FormProgress";
import { GetStartedFormProvider, useGetStartedForm } from "@/app/contexts/GetStartedFormContext";

const STEPS = ["Property Type", "Address", "Details", "Contact", "Review"];

const ADDITIONAL_SERVICES = [
  { id: "tenant-screening", label: "Tenant Screening" },
  { id: "rent-collection", label: "Rent Collection" },
  { id: "maintenance", label: "Maintenance & Repairs" },
  { id: "financial-reporting", label: "Financial Reporting" },
  { id: "legal-compliance", label: "Legal Compliance" },
  { id: "marketing", label: "Marketing & Leasing" },
  { id: "eviction-services", label: "Eviction Services" },
  { id: "inspections", label: "Property Inspections" },
];

function PropertyDetailsContent() {
  const { formData, updateFormData, setCurrentStep } = useGetStartedForm();
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>(
    formData.additionalServices || []
  );

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      numberOfUnits: formData.numberOfUnits || "",
      squareFootage: formData.squareFootage || "",
    },
  });

  const numberOfUnits = watch("numberOfUnits");
  const squareFootage = watch("squareFootage");

  useEffect(() => {
    // Redirect if no property type selected
    if (!formData.propertyType) {
      router.push("/get-started");
    }
  }, [formData.propertyType, router]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const onSubmit = (data: { numberOfUnits: number | string; squareFootage: number | string }) => {
    updateFormData({
      numberOfUnits: data.numberOfUnits ? String(data.numberOfUnits) : undefined,
      squareFootage: data.squareFootage ? String(data.squareFootage) : undefined,
      additionalServices: selectedServices,
    });
    setCurrentStep(4);
    router.push("/get-started/contact");
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.push("/get-started/address");
  };

  // Show number of units field for multi-family properties
  const showUnitsField =
    formData.propertyType === "multi-family" || formData.propertyType === "hoa-coa";

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <FormProgress currentStep={3} totalSteps={5} steps={STEPS} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tell us about your property
            </h1>
            <p className="text-lg text-slate-600">
              This helps us match you with the right property managers
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Property Size Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Number of Units (conditional) */}
                  {showUnitsField && (
                    <div>
                      <Label htmlFor="numberOfUnits">Number of Units</Label>
                      <Input
                        id="numberOfUnits"
                        type="number"
                        min="1"
                        placeholder="e.g., 24"
                        {...register("numberOfUnits")}
                        className="mt-1"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        How many units are in this property?
                      </p>
                    </div>
                  )}

                  {/* Square Footage */}
                  <div className={showUnitsField ? "" : "sm:col-span-2"}>
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      min="1"
                      placeholder="e.g., 2500"
                      {...register("squareFootage")}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Total square footage of the property
                    </p>
                  </div>
                </div>

                {/* Additional Services */}
                <div>
                  <Label className="mb-4 block">
                    What services do you need? <span className="text-slate-500">(Select all that apply)</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ADDITIONAL_SERVICES.map((service) => (
                      <div key={service.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label
                          htmlFor={service.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="lg">
                    Next: Contact Information
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Save & Exit */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-slate-600 hover:text-slate-900 text-sm"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function PropertyDetailsPage() {
  return (
    <GetStartedFormProvider>
      <main className="min-h-screen bg-slate-50 py-12">
        <PropertyDetailsContent />
      </main>
    </GetStartedFormProvider>
  );
}
