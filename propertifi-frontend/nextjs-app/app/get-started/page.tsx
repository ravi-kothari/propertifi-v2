"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormProgress } from "@/app/components/FormProgress";
import { GetStartedFormProvider, useGetStartedForm } from "@/app/contexts/GetStartedFormContext";
import {
  HouseIcon,
  BuildingIcon,
  ApartmentIcon,
  CommercialIcon,
} from "@/app/components/icons";
import { AlertCircle } from "lucide-react";

const PROPERTY_TYPES = [
  {
    value: "single-family",
    label: "Single Family",
    icon: HouseIcon,
    description: "Houses, townhomes, and single-unit properties",
  },
  {
    value: "multi-family",
    label: "Multi-Family",
    icon: BuildingIcon,
    description: "Apartments, duplexes, and multi-unit buildings",
  },
  {
    value: "hoa-coa",
    label: "HOA/COA",
    icon: ApartmentIcon,
    description: "Homeowner and condominium associations",
  },
  {
    value: "commercial",
    label: "Commercial",
    icon: CommercialIcon,
    description: "Office buildings, retail, and commercial spaces",
  },
];

const STEPS = ["Property Type", "Address", "Details", "Contact", "Review"];

function PropertyTypeSelectionContent() {
  const { formData, updateFormData, setCurrentStep } =
    useGetStartedForm();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(formData.propertyType);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    // Check if there's saved progress
    if (formData.propertyType) {
      setShowResume(true);
    }
  }, [formData.propertyType]);

  const handleSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      updateFormData({ propertyType: selectedType });
      setCurrentStep(2);
      router.push("/get-started/address");
    }
  };

  const handleResume = () => {
    // Navigate to the saved step
    setShowResume(false);
    // This will be implemented when we know which step to resume to
    router.push("/get-started/address");
  };

  const handleStartFresh = () => {
    setShowResume(false);
    setSelectedType("");
    updateFormData({ propertyType: "" });
  };

  if (showResume) {
    return (
      <Section spacing="xl">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
                  Welcome Back!
                </h2>
                <p className="text-slate-600 mb-6">
                  We found your saved progress. Would you like to continue where you left off or
                  start fresh?
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button variant="primary" size="lg" onClick={handleResume}>
                    Resume Application
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleStartFresh}>
                    Start Fresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <FormProgress currentStep={1} totalSteps={5} steps={STEPS} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What type of property do you manage?
            </h1>
            <p className="text-lg text-slate-600">
              Select the property type that best describes your rental property
            </p>
          </div>

          {/* Property Type Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {PROPERTY_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;

              return (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-primary-600 shadow-lg"
                      : "hover:ring-2 hover:ring-slate-300"
                  }`}
                  onClick={() => handleSelect(type.value)}
                >
                  <CardContent className="pt-8 pb-6 text-center">
                    <div
                      className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                        isSelected ? "bg-primary-100" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`w-10 h-10 ${
                          isSelected ? "text-primary-600" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <h3
                      className={`font-heading text-xl font-semibold mb-2 ${
                        isSelected ? "text-primary-600" : "text-slate-900"
                      }`}
                    >
                      {type.label}
                    </h3>
                    <p className="text-sm text-slate-600">{type.description}</p>

                    {isSelected && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-primary-600">
                        <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="text-sm font-semibold">Selected</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={!selectedType}
            >
              Next: Address Information
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function GetStartedPage() {
  return (
    <GetStartedFormProvider>
      <main className="min-h-screen bg-slate-50 py-12">
        <PropertyTypeSelectionContent />
      </main>
    </GetStartedFormProvider>
  );
}
