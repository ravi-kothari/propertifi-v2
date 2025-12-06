"use client";

export const dynamic = 'force-dynamic';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Section } from "@/app/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/app/contexts/ComparisonContext";
import {
  ChevronRight,
  Home,
  Star,
  Building2,
  CheckCircle2,
  Calendar,
  TrendingUp,
  DollarSign,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const comparison = useComparison();
  const router = useRouter();

  // Handle case when provider isn't available (during pre-render)
  if (!comparison) {
    return null;
  }

  const { comparisonList, removeFromComparison, clearComparison } = comparison;

  useEffect(() => {
    // Redirect if less than 2 managers selected
    if (comparisonList.length < 2) {
      router.push("/");
    }
  }, [comparisonList.length, router]);

  if (comparisonList.length < 2) {
    return null;
  }

  const comparisonMetrics = [
    { key: "rating", label: "Rating", icon: Star },
    { key: "reviewCount", label: "Reviews", icon: TrendingUp },
    { key: "yearsExperience", label: "Years Experience", icon: Calendar },
    { key: "propertiesManaged", label: "Properties Managed", icon: Building2 },
    { key: "managementFee", label: "Management Fee", icon: DollarSign },
  ];

  return (
    <main>
      {/* Breadcrumbs */}
      <Section spacing="sm" variant="slate">
        <Container>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Compare Property Managers</span>
          </nav>
        </Container>
      </Section>

      {/* Page Header */}
      <Section spacing="md">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Compare Property Managers
              </h1>
              <p className="text-lg text-slate-600">
                Side-by-side comparison of {comparisonList.length} property managers
              </p>
            </div>
            <Button variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
          </div>
        </Container>
      </Section>

      {/* Comparison Table */}
      <Section spacing="lg">
        <Container>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-48 bg-slate-50 p-4 text-left align-top sticky left-0">
                    <div className="font-heading text-lg font-semibold text-slate-900">
                      Feature
                    </div>
                  </th>
                  {comparisonList.map((manager) => (
                    <th key={manager.id} className="bg-white p-4 align-top border-l">
                      <div className="min-w-[250px]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-slate-900 text-sm">
                                {manager.companyName}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {manager.verified && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                )}
                                {manager.featured && (
                                  <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromComparison(manager.id)}
                            className="text-slate-400 hover:text-slate-600"
                            aria-label={`Remove ${manager.companyName}`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Rating */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Rating
                    </div>
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(manager.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-slate-200 text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{manager.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Reviews */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Reviews
                    </div>
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <span className="font-semibold">{manager.reviewCount}</span> reviews
                    </td>
                  ))}
                </tr>

                {/* Experience */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Experience
                    </div>
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <span className="font-semibold">{manager.yearsExperience}</span> years
                    </td>
                  ))}
                </tr>

                {/* Properties Managed */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Properties
                    </div>
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <span className="font-semibold">{manager.propertiesManaged}+</span> properties
                    </td>
                  ))}
                </tr>

                {/* Management Fee */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Fee
                    </div>
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <span className="font-semibold text-primary-600">
                        {manager.managementFee}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l text-sm">
                      {manager.city}, {manager.stateCode}
                    </td>
                  ))}
                </tr>

                {/* Property Types */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0 align-top">
                    Property Types
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <div className="flex flex-wrap gap-1">
                        {manager.propertyTypes.map((type) => (
                          <Badge key={type} variant="default" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Services */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 font-medium text-slate-900 sticky left-0 align-top">
                    Services
                  </td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <ul className="text-sm space-y-1">
                        {manager.services.slice(0, 5).map((service) => (
                          <li key={service} className="flex items-start gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {service}
                          </li>
                        ))}
                        {manager.services.length > 5 && (
                          <li className="text-slate-500">
                            +{manager.services.length - 5} more
                          </li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* CTA Row */}
                <tr className="border-t">
                  <td className="bg-slate-50 p-4 sticky left-0"></td>
                  {comparisonList.map((manager) => (
                    <td key={manager.id} className="p-4 border-l">
                      <Link
                        href={`/property-managers/${manager.stateCode.toLowerCase()}/${manager.city
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${manager.slug}`}
                      >
                        <Button variant="primary" className="w-full">
                          View Full Profile
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </Section>
    </main>
  );
}
