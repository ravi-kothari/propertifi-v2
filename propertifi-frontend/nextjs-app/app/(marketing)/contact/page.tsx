"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Section } from "@/app/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/app/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Contact form submitted:", data);

    toast({
      variant: "success",
      title: "Message Sent!",
      description: "We've received your message and will get back to you soon.",
    });

    reset();
  };

  return (
    <main>
      {/* Hero Section */}
      <Section variant="gradient" spacing="lg">
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
            Have questions? We&apos;re here to help you find the perfect property manager.
          </p>
        </div>
      </Section>

      {/* Contact Content */}
      <Section spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Contact Information (40%) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                Whether you&apos;re a property owner looking for management services or have questions
                about our platform, we&apos;re here to help.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                      <a
                        href="mailto:support@propertifi.com"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        support@propertifi.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                      <a
                        href="tel:+18005551234"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        1-800-555-1234
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Business Hours</h3>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                        Saturday: 10:00 AM - 4:00 PM PST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                      <p className="text-slate-600">
                        123 Property Lane<br />
                        Suite 100<br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Contact Form (60%) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    required
                    errorMessage={errors.name?.message}
                    {...register("name")}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    required
                    errorMessage={errors.email?.message}
                    {...register("email")}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    helperText="Optional - We'll only call if you prefer phone contact"
                    errorMessage={errors.phone?.message}
                    {...register("phone")}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Tell us about your property management needs..."
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Additional Info Section */}
      <Section variant="slate" spacing="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">
            Looking for Property Management?
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            If you&apos;re ready to find property managers in your area, start by telling us
            about your property.
          </p>
          <Button variant="primary" size="lg">
            Get Started Free
          </Button>
        </div>
      </Section>
    </main>
  );
}
