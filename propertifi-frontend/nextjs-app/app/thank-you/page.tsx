import { Section } from "@/app/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main>
      <Section spacing="xl">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          {/* Main Message */}
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Thank You!
          </h1>
          <p className="text-xl text-slate-600 mb-12">
            We've received your request and are excited to help you find the perfect property manager
            for your needs.
          </p>

          {/* What Happens Next */}
          <div className="text-left mb-12">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6 text-center">
              What Happens Next?
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-lg">1</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <Mail className="w-5 h-5 text-primary-600 mt-1" />
                        <h3 className="font-semibold text-lg text-slate-900">
                          Check Your Email
                        </h3>
                      </div>
                      <p className="text-slate-600">
                        We've sent a confirmation email with your matched property managers.
                        Check your inbox (and spam folder) for details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-secondary-600 font-bold text-lg">2</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <Phone className="w-5 h-5 text-secondary-600 mt-1" />
                        <h3 className="font-semibold text-lg text-slate-900">
                          We'll Contact You
                        </h3>
                      </div>
                      <p className="text-slate-600">
                        Our team will reach out within 24 hours to discuss your needs and
                        answer any questions you may have.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-lg">3</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-green-600 mt-1" />
                        <h3 className="font-semibold text-lg text-slate-900">
                          Meet Your Matches
                        </h3>
                      </div>
                      <p className="text-slate-600">
                        Connect with your matched property managers, review their profiles,
                        and schedule consultations to find the perfect fit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button variant="primary" size="lg">
                Return to Home
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Read Our Blog
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Additional Resources */}
      <Section variant="slate" spacing="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6 text-center">
            While You Wait...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Learn More</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Explore our resources on property management best practices
                </p>
                <Link href="/blog">
                  <Button variant="ghost" size="sm">
                    Visit Blog →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❓</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Have Questions?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Check out our FAQ for answers to common questions
                </p>
                <Link href="/faq">
                  <Button variant="ghost" size="sm">
                    View FAQs →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Our support team is here to assist you
                </p>
                <Link href="/contact">
                  <Button variant="ghost" size="sm">
                    Contact Us →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
