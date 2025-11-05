import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/app/components/ui/Input";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, Grid } from "@/app/components/layout";
import { HouseIcon, BuildingIcon, ApartmentIcon, CommercialIcon, FileText, AIBrainIcon, CheckCircleIcon, ShieldCheckIcon, DollarIcon, SpeedIcon } from "@/app/components/icons";
import { Testimonials } from "@/app/components/Testimonials";
import { LatestPosts } from "@/app/components/LatestPosts";
import { LazyLocationBrowser } from "@/app/components/LazyLocationBrowser";
import { getMainAppUrl } from "@/lib/api-client";

function TestimonialSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function LatestPostsSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[175px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Section variant="gradient" spacing="xl">
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI-Powered Property Manager Matching, Simplified
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Find the perfect property manager for your rental properties. Compare verified professionals, read reviews, and get matched in minutes.
          </p>

          {/* Login Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full sm:w-80 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Property Owners</h3>
              <p className="text-slate-200 text-sm mb-4">Find and hire the perfect property manager</p>
              <div className="flex gap-2">
                <a
                  href={getMainAppUrl('/owner/login')}
                  className="flex-1 bg-white text-primary-600 hover:bg-slate-100 font-semibold px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Sign In
                </a>
                <Link
                  href="/get-started"
                  className="flex-1 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full sm:w-80 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Property Managers</h3>
              <p className="text-slate-200 text-sm mb-4">Grow your business and find new clients</p>
              <div className="flex gap-2">
                <a
                  href={getMainAppUrl('/pm/login')}
                  className="flex-1 bg-white text-primary-600 hover:bg-slate-100 font-semibold px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Sign In
                </a>
                <a
                  href={getMainAppUrl('/pm/register')}
                  className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Join Now
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-slate-300 flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <div className="font-bold text-2xl">12,547+</div>
              <div>Properties Managed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">850+</div>
              <div>Verified Managers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">4.9/5</div>
              <div>Average Rating</div>
            </div>
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to find your perfect property manager
          </p>
        </div>
        <Grid cols={3} gap="lg">
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle className="mb-3">Tell Us Your Needs</CardTitle>
              <CardDescription>
                Share details about your property type, location, and management requirements
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AIBrainIcon className="w-8 h-8 text-secondary-600" />
              </div>
              <CardTitle className="mb-3">Get AI-Matched</CardTitle>
              <CardDescription>
                Our AI analyzes hundreds of property managers to find your best matches
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="mb-3">Compare & Choose</CardTitle>
              <CardDescription>
                Review profiles, pricing, and services to select the perfect manager
              </CardDescription>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Property Types */}
      <Section variant="slate" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            All Property Types Covered
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you own a single-family home or a large commercial building, we&apos;ve got you covered
          </p>
        </div>
        <Grid cols={4} gap="md">
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HouseIcon className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="mb-2">Single Family</CardTitle>
              <CardDescription>
                Perfect for individual homes and residential properties
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingIcon className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="mb-2">Multi-Family</CardTitle>
              <CardDescription>
                Duplexes, triplexes, and small apartment buildings
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApartmentIcon className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="mb-2">Apartments</CardTitle>
              <CardDescription>
                Large apartment complexes and residential communities
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CommercialIcon className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="mb-2">Commercial</CardTitle>
              <CardDescription>
                Office buildings, retail spaces, and mixed-use properties
              </CardDescription>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Features */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Why Choose Propertifi?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The smartest way to find and hire property managers
          </p>
        </div>
        <Grid cols={4} gap="lg">
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AIBrainIcon className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg mb-2">AI-Powered Matching</CardTitle>
              <CardDescription className="text-sm">
                Smart algorithms match you with the best property managers for your needs
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg mb-2">Verified Managers</CardTitle>
              <CardDescription className="text-sm">
                All property managers are thoroughly vetted and verified
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg mb-2">Financial Tools</CardTitle>
              <CardDescription className="text-sm">
                ROI calculators, mortgage tools, and rent-vs-buy analysis
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SpeedIcon className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg mb-2">Fast & Easy</CardTitle>
              <CardDescription className="text-sm">
                Get matched with qualified managers in minutes, not days
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg mb-2">Legal Resources</CardTitle>
              <CardDescription className="text-sm">
                Access document templates, landlord laws, and legal forms
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle className="text-lg mb-2">Lead Management</CardTitle>
              <CardDescription className="text-sm">
                Track and manage property inquiries efficiently
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-lg mb-2">Role-Based Access</CardTitle>
              <CardDescription className="text-sm">
                Secure admin dashboard with granular permissions
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center" hover>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AIBrainIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-lg mb-2">Advanced Analytics</CardTitle>
              <CardDescription className="text-sm">
                Comprehensive insights into leads, users, and revenue
              </CardDescription>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Tools & Resources Section */}
      <Section variant="slate" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Powerful Tools & Resources
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to make informed property investment decisions
          </p>
        </div>
        <Grid cols={3} gap="lg">
          <Card hover>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <DollarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Financial Calculators</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Access powerful calculators to analyze your property investments
              </CardDescription>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  ROI Calculator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Mortgage Calculator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Rent vs Buy Analysis
                </li>
              </ul>
              <a
                href={getMainAppUrl('/tools/rental-roi')}
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Try Calculators →
              </a>
            </CardContent>
          </Card>
          <Card hover>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Legal Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Free access to essential landlord documents and templates
              </CardDescription>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Lease Agreements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  State Landlord Laws
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Legal Forms Library
                </li>
              </ul>
              <a
                href={getMainAppUrl('/templates')}
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Browse Templates →
              </a>
            </CardContent>
          </Card>
          <Card hover>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <AIBrainIcon className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Educational Content</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Learn from expert insights and property management guides
              </CardDescription>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Property Management Blog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Investment Strategies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  FAQ & Guides
                </li>
              </ul>
              <Link
                href="/blog"
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Read Blog →
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Testimonials Section */}
      <Section variant="slate" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Thousands of property owners trust Propertifi to find the best managers.
          </p>
        </div>
        <Suspense fallback={<Grid cols={3} gap="lg"><TestimonialSkeleton /><TestimonialSkeleton /><TestimonialSkeleton /></Grid>}>
          <Testimonials />
        </Suspense>
      </Section>

      {/* Latest Blog Posts Section */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            From Our Blog
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tips, trends, and insights for property owners and investors.
          </p>
        </div>
        <Suspense fallback={<Grid cols={3} gap="lg"><LatestPostsSkeleton /><LatestPostsSkeleton /><LatestPostsSkeleton /></Grid>}>
          <LatestPosts />
        </Suspense>
      </Section>

      {/* Location Browser Section */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Browse by Location
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find property managers in your area.
          </p>
        </div>
        <LazyLocationBrowser />
      </Section>

      {/* Stats Section */}
      <Section variant="primary" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Property Owners Nationwide
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of property owners who have found their perfect property manager
          </p>
        </div>
        <Grid cols={4} gap="lg">
          <div className="text-center text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">12,547+</div>
            <div className="text-blue-100">Properties Managed</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">850+</div>
            <div className="text-blue-100">Verified Property Managers</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">98%</div>
            <div className="text-blue-100">Customer Satisfaction</div>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl sm:text-5xl font-bold mb-2">50+</div>
            <div className="text-blue-100">States Covered</div>
          </div>
        </Grid>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" spacing="xl">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Property Manager?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of property owners who trust Propertifi to manage their investments
          </p>
          <Button variant="secondary" size="lg">
            Get Started Free
          </Button>
        </div>
      </Section>
    </main>
  );
}