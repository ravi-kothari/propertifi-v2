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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormProgress } from "@/app/components/FormProgress";
import { GetStartedFormProvider, useGetStartedForm } from "@/app/contexts/GetStartedFormContext";

const STEPS = ["Property Type", "Address", "Details", "Contact", "Review"];

const contactSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
    message: "Invalid phone number (use format: 123-456-7890)",
  }),
  preferredContact: z.enum(["email", "phone"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactInformationContent() {
  const { formData, updateFormData, setCurrentStep } = useGetStartedForm();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      preferredContact: (formData.preferredContact as "email" | "phone" | undefined) || "email",
    },
  });

  const preferredContact = watch("preferredContact");

  useEffect(() => {
    // Redirect if no property type selected
    if (!formData.propertyType) {
      router.push("/get-started");
    }
  }, [formData.propertyType, router]);

  const onSubmit = (data: ContactFormData) => {
    updateFormData(data);
    setCurrentStep(5);
    router.push("/get-started/review");
  };

  const handleBack = () => {
    setCurrentStep(3);
    router.push("/get-started/details");
  };

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <FormProgress currentStep={4} totalSteps={5} steps={STEPS} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How can property managers reach you?
            </h1>
            <p className="text-lg text-slate-600">
              We'll share your information only with property managers you choose
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName")}
                    errorMessage={errors.fullName?.message}
                    className="mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    errorMessage={errors.email?.message}
                    className="mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    {...register("phone")}
                    errorMessage={errors.phone?.message}
                    className="mt-1"
                  />
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <Label className="mb-3 block">
                    Preferred Contact Method <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={preferredContact}
                    onValueChange={(value) =>
                      setValue("preferredContact", value as "email" | "phone", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          preferredContact === "email"
                            ? "border-primary-600 bg-primary-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() =>
                          setValue("preferredContact", "email", { shouldValidate: true })
                        }
                      >
                        <RadioGroupItem value="email" id="email-radio" />
                        <Label htmlFor="email-radio" className="cursor-pointer flex-1">
                          <div className="font-semibold">Email</div>
                          <div className="text-xs text-slate-500">
                            Get responses via email
                          </div>
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          preferredContact === "phone"
                            ? "border-primary-600 bg-primary-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() =>
                          setValue("preferredContact", "phone", { shouldValidate: true })
                        }
                      >
                        <RadioGroupItem value="phone" id="phone-radio" />
                        <Label htmlFor="phone-radio" className="cursor-pointer flex-1">
                          <div className="font-semibold">Phone</div>
                          <div className="text-xs text-slate-500">
                            Get responses via phone call
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Privacy Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Privacy Note:</strong> Your information is secure and will only be
                    shared with property managers you choose to contact. We never sell your data to
                    third parties.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="lg">
                    Review & Submit
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

export default function ContactInformationPage() {
  return (
    <GetStartedFormProvider>
      <main className="min-h-screen bg-slate-50 py-12">
        <ContactInformationContent />
      </main>
    </GetStartedFormProvider>
  );
}
