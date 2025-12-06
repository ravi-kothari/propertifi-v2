"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/components/ui/label";
import { getManagerBySlug } from "@/lib/mock-data/property-managers";
import {
  ChevronRight,
  Home,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Shield,
  Award
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PropertyManagerDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const slug = params.slug as string;
  const state = (params.state as string).toUpperCase();
  const city = (params.city as string).replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const manager = getManagerBySlug(slug);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API in Phase 5
    toast({
      title: "Request Sent!",
      description: "The property manager will contact you soon.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  if (!manager) {
    return (
      <main>
        <Section>
          <Container>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Manager Not Found</h1>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumbs */}
      <Section spacing="sm" variant="slate">
        <Container>
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/property-managers" className="text-slate-600 hover:text-slate-900">
              Property Managers
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link
              href={`/property-managers/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-slate-600 hover:text-slate-900"
            >
              {city}, {state}
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">{manager.companyName}</span>
          </nav>
        </Container>
      </Section>

      {/* Hero Section */}
      <Section spacing="md">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left 2/3 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-6">
                    {/* Logo */}
                    <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-12 h-12 text-slate-400" />
                    </div>

                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2 flex-wrap">
                            {manager.companyName}
                            {manager.verified && (
                              <CheckCircle2 className="w-6 h-6 text-blue-600" />
                            )}
                          </h1>
                          <div className="flex items-center gap-2 flex-wrap">
                            {manager.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                Featured
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < Math.floor(manager.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-slate-200 text-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold text-slate-900">
                                {manager.rating}
                              </span>
                              <span className="text-slate-500">
                                ({manager.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{manager.address}, {manager.city}, {manager.stateCode} {manager.zipCode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${manager.phone}`} className="hover:text-primary-600">
                            {manager.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${manager.email}`} className="hover:text-primary-600">
                            {manager.email}
                          </a>
                        </div>
                        {manager.website && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Globe className="w-4 h-4" />
                            <a
                              href={manager.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary-600"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <a href="#contact-form">
                      <Button variant="primary" size="lg" className="w-full sm:w-auto">
                        Request Quote
                      </Button>
                    </a>
                  </div>
                </CardHeader>
              </Card>

              {/* Tabs Section */}
              <div className="mt-8">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
                    >
                      Reviews ({manager.reviewCount})
                    </TabsTrigger>
                    <TabsTrigger
                      value="portfolio"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
                    >
                      Portfolio ({manager.portfolio.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    {/* About */}
                    <Card>
                      <CardHeader>
                        <CardTitle>About Us</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 leading-relaxed">{manager.aboutUs}</p>
                      </CardContent>
                    </Card>

                    {/* Services */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Services Offered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {manager.services.map((service) => (
                            <div key={service} className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-slate-700">{service}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Property Types */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Property Types Managed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {manager.propertyTypes.map((type) => (
                            <Badge key={type} variant="default" className="text-sm">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Specialties */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Specialties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {manager.specialties.map((specialty) => (
                            <li key={specialty} className="flex items-start gap-2">
                              <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-700">{specialty}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Coverage Area */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Coverage Area</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {manager.coverageArea.map((area) => (
                            <Badge key={area} variant="default" className="text-sm border border-slate-300">
                              <MapPin className="w-3 h-3 mr-1" />
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Pricing</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-slate-600">Management Fee</span>
                          <span className="font-semibold text-primary-600">{manager.managementFee}</span>
                        </div>
                        {manager.leaseCommission && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-600">Lease Commission</span>
                            <span className="font-semibold text-slate-900">{manager.leaseCommission}</span>
                          </div>
                        )}
                        <p className="text-sm text-slate-500 mt-4">
                          * Contact for detailed pricing and custom quotes
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-4">
                      {manager.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <div className="font-semibold text-slate-900 mb-1">
                                  {review.author}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-slate-200 text-slate-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-slate-500">{review.date}</span>
                                </div>
                              </div>
                              {review.propertyType && (
                                <Badge variant="default" className="border border-slate-300">{review.propertyType}</Badge>
                              )}
                            </div>
                            <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Portfolio Tab */}
                  <TabsContent value="portfolio" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {manager.portfolio.map((property) => (
                        <Card key={property.id}>
                          <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 mb-2">
                              {property.name}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Building2 className="w-4 h-4" />
                                <span>{property.type}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>{property.units} units</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span>{property.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sidebar - Right 1/3 */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {manager.yearsExperience}
                        </div>
                        <div className="text-sm text-slate-600">Years in Business</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {manager.propertiesManaged}+
                        </div>
                        <div className="text-sm text-slate-600">Properties Managed</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {manager.rating}
                        </div>
                        <div className="text-sm text-slate-600">Average Rating</div>
                      </div>
                    </div>

                    {manager.verified && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900">Verified</div>
                          <div className="text-sm text-slate-600">Background Checked</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card id="contact-form">
                  <CardHeader>
                    <CardTitle>Request a Quote</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-1"
                        />
                      </div>

                      <Button type="submit" variant="primary" className="w-full">
                        Send Request
                      </Button>

                      <p className="text-xs text-slate-500 text-center">
                        By submitting, you agree to be contacted by this property manager
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
