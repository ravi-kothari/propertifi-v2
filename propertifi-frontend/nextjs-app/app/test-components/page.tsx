"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Input as EnhancedInput } from "@/app/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/app/components/ui/Spinner";
import { LoadingOverlay } from "@/app/components/ui/LoadingOverlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building, LandPlot, Briefcase } from "lucide-react";

export default function TestComponentsPage() {
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const { toast } = useToast();
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      {showLoadingOverlay && <LoadingOverlay />}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            shadcn/ui Component Library
          </h1>
          <p className="text-lg text-slate-600">
            Showcase of all installed shadcn/ui components with examples
          </p>
        </div>

        {/* Components Grid */}
        <div className="space-y-12">
          {/* Button Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Button Component - Propertifi Custom Variants
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Propertifi Brand Button Variants</CardTitle>
                <CardDescription>
                  Custom button styles aligned with Propertifi&apos;s brand identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Propertifi Brand Variants */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Brand Variants
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">
                        Primary (Blue #2563EB)
                      </Button>
                      <Button variant="default">
                        Secondary (Orange #F97316)
                      </Button>
                      <Button variant="outline">
                        Outline (Border Fill)
                      </Button>
                      <Button variant="ghost">
                        Ghost (Minimal)
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      These are our main brand buttons with proper hover effects and transitions
                    </p>
                  </div>

                  {/* All variants including shadcn defaults */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      All Variants
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default">Default/Primary</Button>
                      <Button variant="default">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Sizes
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm" variant="primary">Small</Button>
                      <Button size="default" variant="primary">Default</Button>
                      <Button size="lg" variant="primary">Large</Button>
                      <Button size="icon" variant="primary">🎨</Button>
                    </div>
                  </div>

                  {/* Size Comparison */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Size Comparison (Secondary)
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm" variant="default">Small Button</Button>
                      <Button size="default" variant="default">Default Button</Button>
                      <Button size="lg" variant="default">Large Button</Button>
                    </div>
                  </div>

                  {/* States */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Button States
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button disabled variant="primary">Disabled Primary</Button>
                      <Button disabled variant="default">Disabled Secondary</Button>
                      <Button disabled variant="outline">Disabled Outline</Button>
                      <Button variant="primary">
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </Button>
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Real-World Use Cases
                    </h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button variant="primary" size="lg">
                          Get Started
                        </Button>
                        <Button variant="outline" size="lg">
                          Learn More
                        </Button>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="default">
                          Request a Quote
                        </Button>
                        <Button variant="ghost">
                          Cancel
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm">
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Demo */}
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Hover Effects Preview
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      Hover over these buttons to see the smooth transitions and effects:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">
                        Primary Hover (darkens + shadow)
                      </Button>
                      <Button variant="default">
                        Secondary Hover (darkens + shadow)
                      </Button>
                      <Button variant="outline">
                        Outline Hover (fills with blue)
                      </Button>
                      <Button variant="ghost">
                        Ghost Hover (subtle background)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Input Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Input Component
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>
                  Text input examples with different configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Default Input
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter text here..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Email Input
                    </label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Password Input
                    </label>
                    <Input type="password" placeholder="Enter password" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Disabled Input
                    </label>
                    <Input
                      type="text"
                      placeholder="Disabled input"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Input with File
                    </label>
                    <Input type="file" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Card Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Card Component - Propertifi Enhanced
            </h2>

            {/* Enhanced Features Demo */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Enhanced Card Features</CardTitle>
                <CardDescription>
                  Propertifi cards now support hover effects, featured badges, and image headers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>✓ <strong>Hover Effect:</strong> Add <code className="bg-slate-100 px-1.5 py-0.5 rounded">hover</code> prop for lift and shadow</p>
                  <p>✓ <strong>Featured Badge:</strong> Add <code className="bg-slate-100 px-1.5 py-0.5 rounded">featured</code> prop for corner badge</p>
                  <p>✓ <strong>Image Header:</strong> Pass <code className="bg-slate-100 px-1.5 py-0.5 rounded">image</code> prop to CardHeader</p>
                  <p>✓ <strong>Responsive Padding:</strong> Optimized spacing for all screen sizes</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Manager Card Example */}
            <div className="mb-8">
              <h3 className="font-heading text-xl font-semibold text-slate-900 mb-4">
                Use Case 1: Property Manager Card
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card hover featured>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">PM</span>
                      </div>
                      <div>
                        <CardTitle>Premier Property Mgmt</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500">★★★★★</span>
                          <span className="text-xs text-slate-500">(127 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      Specializing in residential and multi-family properties
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">📍</span>
                        <span className="text-slate-700">Los Angeles, CA</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">🏢</span>
                        <span className="text-slate-700">500+ Properties</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">⏱️</span>
                        <span className="text-slate-700">15 Years Experience</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="primary" className="w-full">View Profile</Button>
                  </CardFooter>
                </Card>

                <Card hover>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-secondary-600">ER</span>
                      </div>
                      <div>
                        <CardTitle>Elite Realty Services</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500">★★★★☆</span>
                          <span className="text-xs text-slate-500">(89 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      Full-service property management solutions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">📍</span>
                        <span className="text-slate-700">San Diego, CA</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">🏢</span>
                        <span className="text-slate-700">300+ Properties</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">⏱️</span>
                        <span className="text-slate-700">10 Years Experience</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </CardFooter>
                </Card>

                <Card hover>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-600">CP</span>
                      </div>
                      <div>
                        <CardTitle>Coastal Properties Inc</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500">★★★★★</span>
                          <span className="text-xs text-slate-500">(203 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      Vacation rentals and long-term leasing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">📍</span>
                        <span className="text-slate-700">Santa Monica, CA</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">🏢</span>
                        <span className="text-slate-700">400+ Properties</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">⏱️</span>
                        <span className="text-slate-700">12 Years Experience</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Blog Post Card Example */}
            <div className="mb-8">
              <h3 className="font-heading text-xl font-semibold text-slate-900 mb-4">
                Use Case 2: Blog Post Card with Image
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card hover>
                  <CardHeader image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop">
                    <CardTitle>Top 10 Property Management Tips</CardTitle>
                    <CardDescription>
                      Essential advice for landlords in 2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                      Learn the best practices for managing rental properties efficiently and maximizing your ROI.
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>5 min read</span>
                      <span>Dec 15, 2024</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0">Read More →</Button>
                  </CardFooter>
                </Card>

                <Card hover featured>
                  <CardHeader image="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop">
                    <CardTitle>AI in Property Management</CardTitle>
                    <CardDescription>
                      How technology is changing the industry
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                      Discover how AI and machine learning are revolutionizing property management operations.
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>8 min read</span>
                      <span>Dec 12, 2024</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0">Read More →</Button>
                  </CardFooter>
                </Card>

                <Card hover>
                  <CardHeader image="https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=400&h=300&fit=crop">
                    <CardTitle>Understanding Rental Laws</CardTitle>
                    <CardDescription>
                      A comprehensive guide for property owners
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                      Navigate the complex world of rental regulations and stay compliant with local laws.
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>12 min read</span>
                      <span>Dec 10, 2024</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0">Read More →</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Stat Card Example */}
            <div className="mb-8">
              <h3 className="font-heading text-xl font-semibold text-slate-900 mb-4">
                Use Case 3: Stat Card with Numbers
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      12,547
                    </div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Properties Managed
                    </div>
                    <div className="text-xs text-slate-500">
                      Across 50 states
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-secondary-500 mb-2">
                      850+
                    </div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Property Managers
                    </div>
                    <div className="text-xs text-slate-500">
                      Verified professionals
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      98%
                    </div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Satisfaction Rate
                    </div>
                    <div className="text-xs text-slate-500">
                      From property owners
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      $2.4B
                    </div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Assets Under Management
                    </div>
                    <div className="text-xs text-slate-500">
                      And growing
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Original Examples */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-slate-900 mb-4">
                Additional Examples
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>
                      A simple card with title and description
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      This is a basic card component that can be used to display
                      content in a structured format.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card with Footer</CardTitle>
                    <CardDescription>
                      Includes a footer with action buttons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      This card demonstrates how to use the CardFooter component
                      for actions.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                  </CardFooter>
                </Card>

                <Card className="bg-primary-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Styled Card</CardTitle>
                    <CardDescription className="text-blue-100">
                      Custom styling applied
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-50">
                      Cards can be customized with different background colors
                      and styles.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Badge Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Badge Component - Propertifi Custom
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Badge Variants & Sizes</CardTitle>
                <CardDescription>
                  Custom badge styles for status indicators and tags.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Propertifi Variants
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="featured">Featured</Badge>
                      <Badge variant="verified">Verified</Badge>
                      <Badge variant="new">New</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      Sizes
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge size="sm">Small</Badge>
                      <Badge size="md">Medium</Badge>
                      <Badge size="lg">Large</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      With Icon
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="verified" size="lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      With Dot
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="new" size="lg">
                        <span className="relative flex h-3 w-3 mr-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        New
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-3">
                      With Close Button
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Badge>
                        <span>Filter</span>
                        <button className="ml-1.5 -mr-0.5 rounded-full p-0.5 hover:bg-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dialog Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Dialog Component - Propertifi Enhanced
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Dialog Examples</CardTitle>
                <CardDescription>
                  Enhanced dialogs with size variants, scrollable content, and custom layouts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* Confirmation Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Confirmation Dialog</Button>
                    </DialogTrigger>
                    <DialogContent size="sm">
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive">Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Form Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Form Dialog</Button>
                    </DialogTrigger>
                    <DialogContent size="md">
                      <DialogHeader>
                        <DialogTitle>Create New Property</DialogTitle>
                        <DialogDescription>
                          Fill in the details below to add a new property to your portfolio.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogBody>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label htmlFor="name">Property Name</label>
                            <Input id="name" placeholder="e.g., Sunset Villa" />
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="address">Address</label>
                            <Input id="address" placeholder="e.g., 123 Main St" />
                          </div>
                        </div>
                      </DialogBody>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Property</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Full-screen Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default">Full-screen Dialog</Button>
                    </DialogTrigger>
                    <DialogContent size="full">
                      <DialogHeader>
                        <DialogTitle>Terms of Service</DialogTitle>
                        <DialogDescription>
                          Please read the terms and conditions carefully before proceeding.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogBody>
                        <div className="prose max-w-none py-4">
                          <p>... (long content here to demonstrate scrolling)</p>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...</p>
                          <p>... (more content)</p>
                        </div>
                      </DialogBody>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>I Accept</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Toast Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Toast Component - Propertifi Notifications
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Toast Examples</CardTitle>
                <CardDescription>
                  Customized toasts for success, error, warning, and info states.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      toast({
                        variant: "success",
                        title: "Success!",
                        description: "Your changes have been saved successfully.",
                      })
                    }
                  >
                    Show Success Toast
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      toast({
                        variant: "destructive",
                        title: "Error!",
                        description: "Something went wrong. Please try again.",
                      })
                    }
                  >
                    Show Error Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast({
                        variant: "warning",
                        title: "Warning!",
                        description: "Your session is about to expire.",
                      })
                    }
                  >
                    Show Warning Toast
                  </Button>
                  <Button
                    variant="default"
                    onClick={() =>
                      toast({
                        variant: "info",
                        title: "Info",
                        description: "A new feature has been added to your account.",
                      })
                    }
                  >
                    Show Info Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Loading States Section */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Loading States
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Skeleton</CardTitle>
                <CardDescription>
                  Examples of skeleton loaders for various components.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Card Skeleton
                    </h3>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Text Skeleton
                    </h3>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Image Skeleton
                    </h3>
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Spinner</CardTitle>
                <CardDescription>
                  Examples of spinners for loading states.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <div className="flex items-center justify-center rounded-md bg-slate-900 p-4">
                    <Spinner size="md" color="white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Loading Overlay</CardTitle>
                <CardDescription>
                  Example of a full-page loading overlay.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setShowLoadingOverlay(true);
                    setTimeout(() => setShowLoadingOverlay(false), 3000);
                  }}
                >
                  Show Loading Overlay (3s)
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Tabs Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Tabs Component
            </h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Property Type Tabs (Underline)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="single-family" className="w-full">
                    <TabsList variant="underline">
                      <TabsTrigger value="single-family">Single Family</TabsTrigger>
                      <TabsTrigger value="multi-family">Multi-Family</TabsTrigger>
                      <TabsTrigger value="hoa-coa">HOA/COA</TabsTrigger>
                      <TabsTrigger value="commercial">Commercial</TabsTrigger>
                    </TabsList>
                    <TabsContent value="single-family">
                      <p className="p-4">Content for single-family properties.</p>
                    </TabsContent>
                    <TabsContent value="multi-family">
                      <p className="p-4">Content for multi-family properties.</p>
                    </TabsContent>
                    <TabsContent value="hoa-coa">
                      <p className="p-4">Content for HOA/COA properties.</p>
                    </TabsContent>
                    <TabsContent value="commercial">
                      <p className="p-4">Content for commercial properties.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blog Category Tabs (Pills)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="landlording">Landlording</TabsTrigger>
                      <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
                      <TabsTrigger value="legal">Legal</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Tabs (Icons and Badges)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="dashboard">
                    <TabsList>
                      <TabsTrigger value="dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger value="properties">
                        <Building className="mr-2 h-4 w-4" />
                        Properties
                        <Badge className="ml-2">3</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="tenants">
                        <LandPlot className="mr-2 h-4 w-4" />
                        Tenants
                      </TabsTrigger>
                      <TabsTrigger value="reports">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Reports
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Select Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Select Component
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Select/Dropdown Examples</CardTitle>
                <CardDescription>
                  Examples of using the select component for dropdowns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Simple Dropdown (States)
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>West Coast</SelectLabel>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="wa">Washington</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>East Coast</SelectLabel>
                          <SelectItem value="tx">Texas</SelectItem>
                          <SelectItem value="fl">Florida</SelectItem>
                          <SelectItem value="ny">New York</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Searchable Dropdown (Cities)
                    </label>
                    <Combobox
                      options={[
                        { value: "los-angeles", label: "Los Angeles" },
                        { value: "san-diego", label: "San Diego" },
                        { value: "san-francisco", label: "San Francisco" },
                        { value: "seattle", label: "Seattle" },
                        { value: "miami", label: "Miami" },
                      ]}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Select a city"
                      searchPlaceholder="Search cities..."
                      noResultsMessage="No cities found."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Multi-select Dropdown (Property Types)
                    </label>
                    <MultiSelect
                      options={[
                        { value: "single-family", label: "Single Family" },
                        { value: "multi-family", label: "Multi-Family" },
                        { value: "hoa-coa", label: "HOA/COA" },
                        { value: "commercial", label: "Commercial" },
                      ]}
                      selected={selectedPropertyTypes}
                      onChange={setSelectedPropertyTypes}
                      placeholder="Select property types..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Enhanced Input Component */}
          <section>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-6">
              Enhanced Input Component
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Input with All States</CardTitle>
                <CardDescription>
                  Enhanced input component with labels, icons, error/success states, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Basic Inputs */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Basic Inputs with Labels
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <EnhancedInput
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        helperText="We'll never share your email"
                      />
                      <EnhancedInput
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        required
                      />
                      <EnhancedInput
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                      />
                      <EnhancedInput
                        label="Phone Number"
                        type="tel"
                        placeholder="(555) 123-4567"
                        helperText="Include area code"
                      />
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Different Sizes
                    </h3>
                    <div className="space-y-4">
                      <EnhancedInput
                        label="Small Input"
                        size="sm"
                        placeholder="Small size (h-8)"
                      />
                      <EnhancedInput
                        label="Medium Input (Default)"
                        size="md"
                        placeholder="Medium size (h-10)"
                      />
                      <EnhancedInput
                        label="Large Input"
                        size="lg"
                        placeholder="Large size (h-12)"
                      />
                    </div>
                  </div>

                  {/* Error and Success States */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Error and Success States
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <EnhancedInput
                        label="Email"
                        type="email"
                        placeholder="invalid-email"
                        errorMessage="Please enter a valid email address"
                      />
                      <EnhancedInput
                        label="Username"
                        type="text"
                        placeholder="johndoe"
                        successMessage="Username is available!"
                      />
                      <EnhancedInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        errorMessage="Password must be at least 8 characters"
                      />
                      <EnhancedInput
                        label="Confirmation Code"
                        type="text"
                        placeholder="123456"
                        successMessage="Code verified successfully"
                      />
                    </div>
                  </div>

                  {/* With Icons */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Inputs with Icons
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <EnhancedInput
                        label="Search"
                        type="text"
                        placeholder="Search properties..."
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        }
                      />
                      <EnhancedInput
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                      />
                      <EnhancedInput
                        label="Location"
                        type="text"
                        placeholder="Enter city or zipcode"
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        }
                      />
                      <EnhancedInput
                        label="Website"
                        type="url"
                        placeholder="https://example.com"
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        }
                      />
                    </div>
                  </div>

                  {/* Disabled State */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Disabled State
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <EnhancedInput
                        label="Disabled Input"
                        type="text"
                        placeholder="Cannot edit this field"
                        disabled
                      />
                      <EnhancedInput
                        label="Pre-filled Disabled"
                        type="text"
                        value="read-only@example.com"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Real-world Form Example */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-4">
                      Real-world Example: Contact Form
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                      <div className="space-y-4">
                        <EnhancedInput
                          label="Full Name"
                          type="text"
                          placeholder="John Doe"
                          required
                        />
                                              <EnhancedInput
                                                label="Email Address"
                                                type="email"
                                                placeholder="john@example.com"
                                                required
                                                leftIcon={
                                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                  </svg>
                                                }
                                              />                        <EnhancedInput
                          label="Phone Number"
                          type="tel"
                          placeholder="(555) 123-4567"
                          helperText="Optional - We may call to verify details"
                          leftIcon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          }
                        />
                        <EnhancedInput
                          label="Property Zipcode"
                          type="text"
                          placeholder="90210"
                          required
                          leftIcon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          }
                        />
                        <Button variant="primary" className="w-full">
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Summary */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="font-heading text-xl font-semibold text-slate-900 mb-2">
              Installation Complete ✓
            </h2>
            <p className="text-slate-700 mb-4">
              All shadcn/ui components have been successfully installed:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>Button</Badge>
              <Badge>Input (Enhanced)</Badge>
              <Badge>Card</Badge>
              <Badge>Badge</Badge>
              <Badge>Dialog</Badge>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}