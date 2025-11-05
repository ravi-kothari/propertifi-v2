import {
  Logo,
  HouseIcon,
  BuildingIcon,
  ApartmentIcon,
  CommercialIcon,
  AIBrainIcon,
  ShieldCheckIcon,
  DollarIcon,
  SpeedIcon,
  CheckCircleIcon,
  StarIcon,
  LocationIcon,
  ArrowRightIcon,
} from "@/app/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function IconsDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            Propertifi Icon Library
          </h1>
          <p className="text-lg text-slate-600">
            Custom SVG icons designed for the Propertifi brand. All icons use
            inline SVG with Tailwind styling for easy customization.
          </p>
        </div>

        <div className="space-y-12">
          {/* Logo Section */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Logo
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Propertifi Logo</CardTitle>
                <CardDescription>
                  Available in full and icon-only variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <p className="text-sm text-slate-600 mb-4">
                      Full Logo (default)
                    </p>
                    <div className="flex items-center gap-8 flex-wrap">
                      <div className="p-4 bg-white rounded-lg border">
                        <Logo className="h-10 w-auto" />
                      </div>
                      <div className="p-4 bg-slate-900 rounded-lg">
                        <Logo className="h-10 w-auto [&_path]:fill-white [&_text]:fill-white" />
                      </div>
                      <div className="p-4 bg-primary-600 rounded-lg">
                        <Logo className="h-10 w-auto [&_path:first-child]:fill-white [&_path:last-child]:fill-primary-600 [&_text]:fill-white" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-4">
                      Icon Only (variant=&quot;icon&quot;)
                    </p>
                    <div className="flex items-center gap-8 flex-wrap">
                      <div className="p-4 bg-white rounded-lg border">
                        <Logo variant="icon" className="h-12 w-12" />
                      </div>
                      <div className="p-4 bg-slate-900 rounded-lg">
                        <Logo
                          variant="icon"
                          className="h-12 w-12 [&_path:first-child]:fill-white [&_path:last-child]:fill-slate-900"
                        />
                      </div>
                      <div className="p-4 bg-primary-600 rounded-lg">
                        <Logo variant="icon" className="h-12 w-12" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Usage:
                    </p>
                    <code className="text-xs bg-slate-800 text-slate-100 p-3 rounded block">
                      {`import { Logo } from "@/app/components/icons";

// Full logo
<Logo className="h-8 w-auto" />

// Icon only
<Logo variant="icon" className="h-10 w-10" />`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Property Types Icons */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Property Type Icons
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Property Type Icons</CardTitle>
                <CardDescription>
                  Icons representing different property types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                      <HouseIcon className="w-10 h-10 text-primary-600" />
                    </div>
                    <p className="font-medium text-slate-900">House</p>
                    <p className="text-xs text-slate-500">Single Family</p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                      <BuildingIcon className="w-10 h-10 text-secondary-500" />
                    </div>
                    <p className="font-medium text-slate-900">Building</p>
                    <p className="text-xs text-slate-500">Multi-Family</p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                      <ApartmentIcon className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="font-medium text-slate-900">Apartment</p>
                    <p className="text-xs text-slate-500">HOA/COA</p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                      <CommercialIcon className="w-10 h-10 text-purple-600" />
                    </div>
                    <p className="font-medium text-slate-900">Commercial</p>
                    <p className="text-xs text-slate-500">Business</p>
                  </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg mt-6">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Usage:
                  </p>
                  <code className="text-xs bg-slate-800 text-slate-100 p-3 rounded block">
                    {`import { HouseIcon, BuildingIcon, ApartmentIcon, CommercialIcon } from "@/app/components/icons";

<HouseIcon className="w-8 h-8 text-primary-600" />
<BuildingIcon className="w-8 h-8 text-secondary-500" />`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Feature Icons */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Feature Icons
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Feature & Utility Icons</CardTitle>
                <CardDescription>
                  Icons for features, benefits, and general UI elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Main Feature Icons */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-4">
                      Main Features
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                          <AIBrainIcon className="w-10 h-10 text-primary-600" />
                        </div>
                        <p className="font-medium text-slate-900">AI Brain</p>
                        <p className="text-xs text-slate-500">AI Matching</p>
                      </div>

                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                          <ShieldCheckIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <p className="font-medium text-slate-900">Shield Check</p>
                        <p className="text-xs text-slate-500">Verified</p>
                      </div>

                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                          <DollarIcon className="w-10 h-10 text-emerald-600" />
                        </div>
                        <p className="font-medium text-slate-900">Dollar</p>
                        <p className="text-xs text-slate-500">Pricing</p>
                      </div>

                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
                          <SpeedIcon className="w-10 h-10 text-yellow-600" />
                        </div>
                        <p className="font-medium text-slate-900">Speed</p>
                        <p className="text-xs text-slate-500">Fast Results</p>
                      </div>
                    </div>
                  </div>

                  {/* Utility Icons */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-4">
                      Utility Icons
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                          <CheckCircleIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <p className="font-medium text-slate-900">Check Circle</p>
                        <p className="text-xs text-slate-500">Success</p>
                      </div>

                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
                          <StarIcon className="w-10 h-10 text-yellow-500" />
                        </div>
                        <p className="font-medium text-slate-900">Star</p>
                        <p className="text-xs text-slate-500">Rating</p>
                      </div>

                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                          <LocationIcon className="w-10 h-10 text-red-600" />
                        </div>
                        <p className="font-medium text-slate-900">Location</p>
                        <p className="text-xs text-slate-500">Map Pin</p>
                      </div>

                      <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                          <ArrowRightIcon className="w-10 h-10 text-slate-700" />
                        </div>
                        <p className="font-medium text-slate-900">Arrow Right</p>
                        <p className="text-xs text-slate-500">Navigation</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Usage:
                    </p>
                    <code className="text-xs bg-slate-800 text-slate-100 p-3 rounded block whitespace-pre">
                      {`import { AIBrainIcon, ShieldCheckIcon, DollarIcon, SpeedIcon } from "@/app/components/icons";

<AIBrainIcon className="w-6 h-6 text-primary-600" />
<ShieldCheckIcon className="w-6 h-6 text-green-600" />`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Customization Examples */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Customization Examples
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Styling & Customization</CardTitle>
                <CardDescription>
                  All icons support Tailwind classes for easy customization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Size Variations */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Size Variations
                    </p>
                    <div className="flex items-end gap-6">
                      <HouseIcon className="w-4 h-4 text-primary-600" />
                      <HouseIcon className="w-6 h-6 text-primary-600" />
                      <HouseIcon className="w-8 h-8 text-primary-600" />
                      <HouseIcon className="w-12 h-12 text-primary-600" />
                      <HouseIcon className="w-16 h-16 text-primary-600" />
                    </div>
                  </div>

                  {/* Color Variations */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Color Variations
                    </p>
                    <div className="flex items-center gap-6">
                      <BuildingIcon className="w-10 h-10 text-primary-600" />
                      <BuildingIcon className="w-10 h-10 text-secondary-500" />
                      <BuildingIcon className="w-10 h-10 text-green-600" />
                      <BuildingIcon className="w-10 h-10 text-purple-600" />
                      <BuildingIcon className="w-10 h-10 text-slate-400" />
                    </div>
                  </div>

                  {/* With Backgrounds */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      With Backgrounds
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-primary-600 rounded-lg">
                        <AIBrainIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-4 bg-secondary-500 rounded-lg">
                        <ShieldCheckIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-4 bg-green-600 rounded-full">
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="p-4 border-2 border-primary-600 rounded-lg">
                        <DollarIcon className="w-8 h-8 text-primary-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
