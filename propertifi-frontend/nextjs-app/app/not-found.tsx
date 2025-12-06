"use client";

import { Section } from "@/app/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchComponent } from "@/app/components/ui/Search";
import { Home, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const handleSearch = (query: string) => {
    // In a real app, this would navigate to search results
    console.log("Searching for:", query);
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  return (
    <main>
      <Section spacing="xl">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="font-heading text-[150px] sm:text-[200px] font-bold text-slate-200 leading-none">
              404
            </h1>
            <div className="relative -mt-20">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-primary-100 rounded-full">
                <span className="text-6xl">🏠</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            Let's get you back on track.
          </p>

          {/* Search Bar */}
          <div className="mb-12">
            <p className="text-sm font-medium text-slate-700 mb-4">
              Try searching for what you need:
            </p>
            <SearchComponent
              onSearch={handleSearch}
              suggestions={[
                "Property managers in California",
                "How to choose a property manager",
                "Contact us",
                "Blog articles",
              ]}
            />
          </div>

          {/* Helpful Links */}
          <div className="mb-12">
            <h3 className="font-semibold text-slate-900 mb-6">Popular Pages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Home className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Home</h4>
                    <p className="text-sm text-slate-600">
                      Return to homepage
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blog">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Resources</h4>
                    <p className="text-sm text-slate-600">
                      Browse our blog
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/contact">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Contact Us</h4>
                    <p className="text-sm text-slate-600">
                      Get in touch
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go to Homepage
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Additional Help Section */}
      <Section variant="slate" spacing="lg">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">
            Looking for Property Management Services?
          </h3>
          <p className="text-slate-600 mb-6">
            Get matched with qualified property managers in your area in just minutes
          </p>
          <Link href="/">
            <Button variant="default" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </Section>
    </main>
  );
}
