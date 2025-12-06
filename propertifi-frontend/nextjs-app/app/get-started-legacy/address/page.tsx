"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/components/ui/label";
import { FormProgress } from "@/app/components/FormProgress";
import { GetStartedFormProvider, useGetStartedForm } from "@/app/contexts/GetStartedFormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STEPS = ["Property Type", "Address", "Details", "Contact", "Review"];

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const addressSchema = z.object({
  streetAddress: z.string().min(5, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(1, { message: "Please select a state" }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code (use 12345 or 12345-6789)" }),
});

type AddressFormData = z.infer<typeof addressSchema>;

function AddressInputContent() {
  const { formData, updateFormData, setCurrentStep } = useGetStartedForm();
  const router = useRouter();
  const [selectedState, setSelectedState] = useState(formData.state);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    },
  });

  useEffect(() => {
    // Redirect if no property type selected
    if (!formData.propertyType) {
      router.push("/get-started");
    }
  }, [formData.propertyType, router]);

  const onSubmit = (data: AddressFormData) => {
    updateFormData(data);
    setCurrentStep(3);
    router.push("/get-started/details");
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.push("/get-started");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setValue("state", value, { shouldValidate: true });
  };

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <FormProgress currentStep={2} totalSteps={5} steps={STEPS} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Where is your property located?
            </h1>
            <p className="text-lg text-slate-600">
              Enter the address of the property you need help managing
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Street Address */}
                <div>
                  <Label htmlFor="streetAddress">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="streetAddress"
                    type="text"
                    placeholder="123 Main St"
                    {...register("streetAddress")}
                    errorMessage={errors.streetAddress?.message}
                    className="mt-1"
                  />
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Los Angeles"
                    {...register("city")}
                    errorMessage={errors.city?.message}
                    className="mt-1"
                  />
                </div>

                {/* State & ZIP Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Select value={selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="90001"
                      {...register("zipCode")}
                      errorMessage={errors.zipCode?.message}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="lg">
                    Next: Property Details
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

export default function AddressPage() {
  return (
    <GetStartedFormProvider>
      <main className="min-h-screen bg-slate-50 py-12">
        <AddressInputContent />
      </main>
    </GetStartedFormProvider>
  );
}
