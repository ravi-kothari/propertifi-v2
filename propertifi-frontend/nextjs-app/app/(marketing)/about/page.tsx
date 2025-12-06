import { Section, Grid } from "@/app/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIBrainIcon, ShieldCheckIcon, DollarIcon, SpeedIcon, FileText, CheckCircleIcon } from "@/app/components/icons";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <Section variant="gradient" spacing="xl">
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About Propertifi
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
            Connecting property owners with exceptional property managers through AI-powered matching technology
          </p>
        </div>
      </Section>

      {/* Mission Statement */}
      <Section spacing="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            At Propertifi, we believe that finding the right property manager shouldn&apos;t be a time-consuming,
            stressful process. Our mission is to simplify property management by connecting property owners with
            qualified, verified property managers who are the perfect fit for their unique needs.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            We leverage cutting-edge AI technology to analyze property characteristics, management requirements,
            and professional qualifications to deliver matches that save time, reduce stress, and maximize the
            value of your investment.
          </p>
        </div>
      </Section>

      {/* How It Works - Detailed Version */}
      <Section variant="slate" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How Propertifi Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our streamlined process makes finding the perfect property manager simple and efficient
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                Step 1
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">
                Tell Us About Your Property
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Complete our simple questionnaire about your property type, location, size, and specific management
                needs. This takes just 5 minutes and helps our AI understand exactly what you&apos;re looking for
                in a property manager.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center">
                <AIBrainIcon className="w-10 h-10 text-secondary-600" />
              </div>
            </div>
            <div className="flex-1 md:text-right">
              <div className="inline-block bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                Step 2
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">
                AI-Powered Matching
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Our advanced AI algorithm analyzes hundreds of property managers in your area, evaluating their
                experience, specialties, pricing, and track record. Within seconds, we identify the managers who
                are the best fit for your specific situation.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                Step 3
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">
                Compare and Choose
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Review detailed profiles of your matched property managers, including pricing, services offered,
                client reviews, and portfolio. Compare them side-by-side, reach out for quotes, and select the
                manager that&apos;s perfect for you.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Why Choose Propertifi?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We&apos;re more than just a directory—we&apos;re your partner in property management success
          </p>
        </div>

        <Grid cols={2} gap="lg">
          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <AIBrainIcon className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle>AI-Powered Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our proprietary AI technology goes beyond simple keyword matching. We analyze property
                characteristics, management requirements, and professional qualifications to deliver truly
                personalized matches that meet your specific needs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Verified Professionals Only</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Every property manager on our platform undergoes a rigorous verification process. We check
                licenses, credentials, insurance, and references to ensure you&apos;re only matched with
                qualified, trustworthy professionals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <DollarIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle>Complete Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                No hidden fees, no surprises. Compare pricing structures, service offerings, and contract
                terms side-by-side before making your decision. We believe in complete transparency so you
                can make informed choices.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <SpeedIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle>Lightning-Fast Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                What used to take weeks of research, phone calls, and meetings now takes minutes. Our
                platform delivers qualified matches instantly, so you can start interviewing property
                managers the same day.
              </CardDescription>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Team Section - Placeholder */}
      <Section variant="slate" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Our Team
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Built by property management experts and technology innovators
          </p>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-slate-700 leading-relaxed">
            Propertifi was founded by a team of real estate professionals and software engineers who
            experienced firsthand the challenges of finding quality property management. We combined our
            industry expertise with cutting-edge AI technology to create a platform that solves this problem
            for property owners everywhere.
          </p>
        </div>
      </Section>

      {/* Stats Section */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform connects property owners with exceptional managers nationwide
          </p>
        </div>

        <Grid cols={4} gap="lg">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">12,547</div>
            <div className="text-slate-700 font-medium">Properties Managed</div>
          </div>

          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">850+</div>
            <div className="text-slate-700 font-medium">Verified Managers</div>
          </div>

          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-slate-700 font-medium">Satisfaction Rate</div>
          </div>

          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">50</div>
            <div className="text-slate-700 font-medium">States Covered</div>
          </div>
        </Grid>
      </Section>

      {/* Final CTA */}
      <Section variant="dark" spacing="xl">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Property Manager?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of property owners who trust Propertifi to manage their investments
          </p>
          <Button variant="default" size="lg">
            Get Started Free
          </Button>
        </div>
      </Section>
    </main>
  );
}
