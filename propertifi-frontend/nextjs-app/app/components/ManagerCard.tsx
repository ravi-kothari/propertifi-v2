"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, MapPin, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PropertyManager } from "@/lib/mock-data/property-managers";
import { useComparison } from "@/app/contexts/ComparisonContext";
import { useToast } from "@/hooks/use-toast";

interface ManagerCardProps {
  manager: PropertyManager;
}

export function ManagerCard({ manager }: ManagerCardProps) {
  const comparison = useComparison();
  const { toast } = useToast();

  if (!comparison) {
    return null;
  }

  const { addToComparison, removeFromComparison, isInComparison, comparisonList } = comparison;
  const isSelected = isInComparison(manager.id);

  const handleCompareChange = (checked: boolean) => {
    if (checked) {
      if (comparisonList.length >= 3) {
        toast({
          variant: "destructive",
          title: "Maximum reached",
          description: "You can only compare up to 3 property managers at a time.",
        });
        return;
      }
      addToComparison(manager);
    } else {
      removeFromComparison(manager.id);
    }
  };
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="relative pb-4">
        {manager.featured && (
          <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 border-yellow-300">
            Featured
          </Badge>
        )}

        <div className="flex items-start gap-4">
          {/* Logo Placeholder */}
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-10 h-10 text-slate-400" />
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  {manager.companyName}
                  {manager.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </h3>
                <div className="flex items-center gap-1 mb-2">
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
                  <span className="text-sm font-medium text-slate-700">
                    {manager.rating}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({manager.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-600 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>{manager.address}, {manager.city}, {manager.stateCode}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {manager.description}
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-200">
          <div>
            <div className="text-xs text-slate-500 mb-1">Experience</div>
            <div className="font-semibold text-slate-900">{manager.yearsExperience} Years</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Properties Managed</div>
            <div className="font-semibold text-slate-900">{manager.propertiesManaged}+</div>
          </div>
        </div>

        {/* Property Types */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Property Types</div>
          <div className="flex flex-wrap gap-2">
            {manager.propertyTypes.slice(0, 3).map((type) => (
              <Badge key={type} variant="default" className="text-xs">
                {type}
              </Badge>
            ))}
            {manager.propertyTypes.length > 3 && (
              <Badge variant="default" className="text-xs border border-slate-300">
                +{manager.propertyTypes.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Management Fee */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Management Fee</div>
          <div className="font-semibold text-primary-600">{manager.managementFee}</div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/property-managers/${manager.stateCode.toLowerCase()}/${manager.city.toLowerCase().replace(/\s+/g, '-')}/${manager.slug}`}
          className="block"
        >
          <Button variant="primary" className="w-full">
            View Profile
          </Button>
        </Link>

        {/* Contact Info */}
        <div className="flex items-center justify-between text-sm">
          <a
            href={`tel:${manager.phone}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {manager.phone}
          </a>
          {manager.website && (
            <a
              href={manager.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900"
            >
              Visit Website →
            </a>
          )}
        </div>

        {/* Add to Compare */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`compare-${manager.id}`}
              checked={isSelected}
              onCheckedChange={handleCompareChange}
            />
            <Label
              htmlFor={`compare-${manager.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              Add to Compare
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
