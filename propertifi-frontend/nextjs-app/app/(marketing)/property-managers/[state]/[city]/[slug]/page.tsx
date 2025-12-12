"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/components/ui/label";
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
  Award,
  DollarSign,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Interface matching the scraped JSON structure
interface PropertyManager {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  service_types: string;
  years_in_business: string;
  rentals_managed: string;
  bbb_rating: string;
  management_fee: string;
  tenant_placement_fee: string;
  lease_renewal_fee: string | null;
  miscellaneous_fees: string | null;
  source_url: string;
}

export default function PropertyManagerDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const slug = params.slug as string;
  const state = (params.state as string).toUpperCase();
  const city = (params.city as string).replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Mock data fetching - In a real app, this would be a fetch call to your API
  // identifying the manager by the slug/id
  const [manager, setManager] = useState<PropertyManager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with mock data based on the scraped structure
    // In production, fetch `/api/property-managers/${slug}`
    const fetchManager = async () => {
      setLoading(true);
      // Simulating a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setManager({
        name: "Ziprent",
        address: "1150 S Olive St 10th Floor",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90015",
        phone: "(213) 722-6030",
        email: "renewals@ziprent.com",
        website: "https://ziprent.com",
        description: "Ziprent brings landlords a modern, technology driven approach to property management and tenant placement, blending local market expertise, smart automation, and clear flat fee pricing to keep rental properties consistently filled with reliable, qualified tenants.",
        service_types: "Residential Single Family Homes, Multi-Family",
        years_in_business: "6+ years",
        rentals_managed: "4,000+",
        bbb_rating: "A+",
        management_fee: "$150 per month (Flat Fee)",
        tenant_placement_fee: "$1,500 paid after tenant is placed",
        lease_renewal_fee: "$250",
        miscellaneous_fees: "N/A",
        source_url: "https://ipropertymanagement.com"
      });
      setLoading(false);
    };

    fetchManager();
  }, [slug]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    unitCount: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API
    toast({
      title: "Lead Submitted!",
      description: `Your request has been sent to ${manager?.name}. They will contact you shortly.`,
    });
    setFormData({ name: "", email: "", phone: "", propertyAddress: "", unitCount: "", message: "" });
  };

  if (loading) {
    return (
      <main className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </main>
    );
  }

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

  // Helper to split service types string into array
  const servicesList = manager.service_types ? manager.service_types.split(',').map(s => s.trim()) : [];

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <Container>
          <nav className="flex items-center gap-2 text-sm py-4 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-primary-600">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/property-managers" className="text-slate-500 hover:text-primary-600">
              Property Managers
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link
              href={`/property-managers/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-slate-500 hover:text-primary-600"
            >
              {city}, {state}
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">{manager.name}</span>
          </nav>
        </Container>
      </div>

      <Section spacing="md">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left 2/3 */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <Card className="overflow-hidden border-none shadow-md">
                <div className="bg-primary-600 h-24 relative">
                  <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-xl shadow-sm">
                    <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-100">
                      <Building2 className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>
                </div>
                <CardContent className="pt-16 pb-8 px-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        {manager.name}
                        <CheckCircle2 className="w-6 h-6 text-blue-500" aria-label="Verified" />
                      </h1>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        {manager.bbb_rating && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            BBB Rating: {manager.bbb_rating}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-slate-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          {manager.city}, {manager.state}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {manager.website && (
                        <a href={manager.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Globe className="w-4 h-4" /> Website
                          </Button>
                        </a>
                      )}
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="gap-2 bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                        onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Request Free Quote <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Experience</div>
                        <div className="font-semibold text-slate-900">{manager.years_in_business}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Managed</div>
                        <div className="font-semibold text-slate-900">{manager.rentals_managed}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Type</div>
                        <div className="font-semibold text-slate-900 line-clamp-1">{servicesList[0] || 'Full Service'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>About {manager.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {manager.description}
                  </p>
                </CardContent>
              </Card>

              {/* Fees & Pricing */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Management Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                    <div className="divide-y divide-slate-200">
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="font-medium text-slate-700">Management Fee</div>
                        <div className="sm:col-span-2 text-slate-900">{manager.management_fee}</div>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="font-medium text-slate-700">Tenant Placement</div>
                        <div className="sm:col-span-2 text-slate-900">{manager.tenant_placement_fee}</div>
                      </div>
                      {manager.lease_renewal_fee && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="font-medium text-slate-700">Lease Renewal</div>
                          <div className="sm:col-span-2 text-slate-900">{manager.lease_renewal_fee}</div>
                        </div>
                      )}
                      {manager.miscellaneous_fees && manager.miscellaneous_fees !== "N/A" && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="font-medium text-slate-700">Other Fees</div>
                          <div className="sm:col-span-2 text-slate-900">{manager.miscellaneous_fees}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicesList.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right 1/3 */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Propertifi Matching CTA - New Upsell */}
                <Card className="border-none shadow-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Building2 className="w-32 h-32 text-white" />
                  </div>
                  <CardContent className="relative p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Want the Best Deal?</h3>
                    <p className="text-blue-50 text-sm mb-6 leading-relaxed">
                      Don't settle for the first quote. Let our AI compare <strong>{manager.name}</strong> against 3 other top-rated local managers to ensure you get the best rate and service.
                    </p>
                    <Link href="/">
                      <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md border-none">
                        Find My Best Match
                      </Button>
                    </Link>
                    <p className="text-xs text-blue-200 mt-3 font-medium">
                      Free Service • No Obligation
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Form Card */}
                <Card id="contact-form" className="border-primary-100 shadow-lg ring-1 ring-primary-50">
                  <div className="bg-white p-4 border-b border-slate-100 rounded-t-lg">
                    <h3 className="font-bold text-lg text-slate-900">Contact {manager.name}</h3>
                    <p className="text-slate-500 text-sm">Send a direct message to this manager.</p>
                  </div>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="name" className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-slate-50 border-slate-200"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="email" className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-slate-50 border-slate-200"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="phone" className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 555-5555"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-slate-50 border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <Label className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2 block">Property Details</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <Input
                              placeholder="Property Address"
                              value={formData.propertyAddress}
                              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                              className="bg-slate-50 border-slate-200"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              placeholder="Number of Units"
                              value={formData.unitCount}
                              onChange={(e) => setFormData({ ...formData, unitCount: e.target.value })}
                              className="bg-slate-50 border-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Message</Label>
                        <textarea
                          id="message"
                          placeholder="I'm looking for management for my property..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-1 text-sm"
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:scale-[1.02]">
                        Send Message to Manager
                      </Button>

                      <p className="text-xs text-slate-400 text-center leading-tight">
                        By clicking "Send Message", you agree to Propertifi's Terms of Service and Privacy Policy.
                      </p>
                    </form>
                  </CardContent>
                </Card>

                {/* Direct Contact Info */}
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Direct Contact Info</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{manager.address}, {manager.city}, {manager.state} {manager.zip_code}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${manager.phone}`} className="hover:text-primary-600 font-medium">
                          {manager.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a href={`mailto:${manager.email}`} className="hover:text-primary-600">
                          {manager.email}
                        </a>
                      </div>
                    </div>
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