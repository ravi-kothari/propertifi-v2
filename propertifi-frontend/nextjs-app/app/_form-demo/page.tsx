"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/app/components/form/FormField";
import { FormSection } from "@/app/components/form/FormSection";
import { FormActions } from "@/app/components/form/FormActions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const dynamic = 'force-dynamic';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
  terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms and conditions." }),
  contactMethod: z.enum(["email", "phone"], { message: "Please select a contact method." }),
});

export default function FormDemoPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      state: "",
      terms: false,
      contactMethod: "email",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      variant: "success",
      title: "Success!",
      description: "Your form has been submitted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            Form Demo
          </h1>
          <p className="text-lg text-slate-600">
            A demonstration of form components with validation.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection title="Personal Information">
            <FormField
              name="name"
              label="Name"
              placeholder="John Doe"
            />
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
            />
          </FormSection>

          <FormSection title="Location">
            <Controller
              name="state"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca">California</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="tx">Texas</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormSection>

          <FormSection title="Preferences">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" {...form.register("terms")} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              {form.formState.errors.terms && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.terms.message}</p>
              )}
            </div>

            <RadioGroup
              onValueChange={(value) => form.setValue("contactMethod", value as "email" | "phone")}
              defaultValue={form.getValues("contactMethod")}
              className="flex flex-col space-y-1"
            >
              <Label>Preferred Contact Method</Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone">Phone</Label>
              </div>
            </RadioGroup>
          </FormSection>

          <FormActions isSubmitting={form.formState.isSubmitting} />
        </form>
      </div>
    </div>
  );
}
