import {
  Heading,
  Paragraph,
  Label,
  Code,
  Blockquote,
  List,
  Lead,
  Muted,
} from "@/app/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TypographyDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <Heading level="h1" className="mb-4">
            Typography System
          </Heading>
          <Lead>
            A comprehensive typography component system for Propertifi using
            Plus Jakarta Sans for headings and Inter for body text.
          </Lead>
        </div>

        {/* Components Demo */}
        <div className="space-y-12">
          {/* Headings Section */}
          <section>
            <Heading level="h2" className="mb-6">
              Heading Components
            </Heading>
            <Card>
              <CardHeader>
                <CardTitle>H1 - H6 Headings</CardTitle>
                <CardDescription>
                  All heading levels with responsive sizing using Plus Jakarta
                  Sans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Muted className="mb-2">Heading Level 1 (h1)</Muted>
                    <Heading level="h1">
                      AI-Powered Property Manager Matching
                    </Heading>
                  </div>

                  <div>
                    <Muted className="mb-2">Heading Level 2 (h2)</Muted>
                    <Heading level="h2">Find Your Perfect Match</Heading>
                  </div>

                  <div>
                    <Muted className="mb-2">Heading Level 3 (h3)</Muted>
                    <Heading level="h3">
                      Trusted by Property Owners Nationwide
                    </Heading>
                  </div>

                  <div>
                    <Muted className="mb-2">Heading Level 4 (h4)</Muted>
                    <Heading level="h4">How It Works</Heading>
                  </div>

                  <div>
                    <Muted className="mb-2">Heading Level 5 (h5)</Muted>
                    <Heading level="h5">Get Started in Minutes</Heading>
                  </div>

                  <div>
                    <Muted className="mb-2">Heading Level 6 (h6)</Muted>
                    <Heading level="h6">Contact Our Support Team</Heading>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <Muted className="mb-2">
                      Example: Using different semantic level
                    </Muted>
                    <Heading level="h3" as="h2">
                      This is styled as H3 but renders as H2
                    </Heading>
                    <Paragraph variant="small" className="mt-2">
                      Use the <Code>as</Code> prop to change the HTML element
                      while keeping the visual styling.
                    </Paragraph>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Paragraph Section */}
          <section>
            <Heading level="h2" className="mb-6">
              Paragraph Components
            </Heading>
            <Card>
              <CardHeader>
                <CardTitle>Body Text Variants</CardTitle>
                <CardDescription>
                  Three paragraph sizes for different contexts using Inter font
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Muted className="mb-2">Large Paragraph</Muted>
                    <Paragraph variant="large">
                      This is a large paragraph variant, perfect for
                      introductory text or emphasizing important content. It
                      uses a larger font size for better readability and draws
                      the reader&apos;s attention to key information.
                    </Paragraph>
                  </div>

                  <div>
                    <Muted className="mb-2">Normal Paragraph (Default)</Muted>
                    <Paragraph variant="normal">
                      This is the standard paragraph variant, ideal for body
                      text throughout your application. It provides optimal
                      readability at the base font size and is the most
                      commonly used variant for general content.
                    </Paragraph>
                  </div>

                  <div>
                    <Muted className="mb-2">Small Paragraph</Muted>
                    <Paragraph variant="small">
                      This is a small paragraph variant, suitable for secondary
                      information, captions, or fine print. While smaller, it
                      maintains readability with proper line height and spacing.
                    </Paragraph>
                  </div>

                  <div className="bg-slate-100 p-4 rounded-lg">
                    <Muted className="mb-2">Multiple Paragraphs Example</Muted>
                    <div className="space-y-4">
                      <Paragraph>
                        Propertifi connects property owners with top-rated
                        property managers in their area. Our AI-powered matching
                        system analyzes your specific needs and preferences.
                      </Paragraph>
                      <Paragraph>
                        We evaluate property managers based on experience,
                        customer reviews, service offerings, and pricing to
                        ensure you get the best match for your investment
                        property.
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Label Section */}
          <section>
            <Heading level="h2" className="mb-6">
              Label Components
            </Heading>
            <Card>
              <CardHeader>
                <CardTitle>Form Labels</CardTitle>
                <CardDescription>
                  Labels with size variants and required field indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-w-md">
                  <div>
                    <Muted className="mb-3">Default Label</Muted>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                  </div>

                  <div>
                    <Muted className="mb-3">Required Label</Muted>
                    <div className="space-y-2">
                      <Label htmlFor="name" required>
                        Full Name
                      </Label>
                      <Input id="name" type="text" placeholder="John Doe" />
                    </div>
                  </div>

                  <div>
                    <Muted className="mb-3">Large Label</Muted>
                    <div className="space-y-2">
                      <Label htmlFor="property" size="large" required>
                        Property Address
                      </Label>
                      <Input
                        id="property"
                        type="text"
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>

                  <div>
                    <Muted className="mb-3">Small Label</Muted>
                    <div className="space-y-2">
                      <Label htmlFor="zip" size="small">
                        ZIP Code
                      </Label>
                      <Input id="zip" type="text" placeholder="90210" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Code Section */}
          <section>
            <Heading level="h2" className="mb-6">
              Code Components
            </Heading>
            <Card>
              <CardHeader>
                <CardTitle>Inline Code</CardTitle>
                <CardDescription>
                  Code snippets with different color variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Muted className="mb-2">Default Code</Muted>
                    <Paragraph>
                      Use the <Code>Button</Code> component with{" "}
                      <Code>variant=&quot;primary&quot;</Code> for main actions.
                    </Paragraph>
                  </div>

                  <div>
                    <Muted className="mb-2">Primary Variant</Muted>
                    <Paragraph>
                      Import components from{" "}
                      <Code variant="primary">@/components/ui/button</Code> to
                      use in your application.
                    </Paragraph>
                  </div>

                  <div>
                    <Muted className="mb-2">Secondary Variant</Muted>
                    <Paragraph>
                      Run <Code variant="secondary">npm run dev</Code> to start
                      the development server on port 3000.
                    </Paragraph>
                  </div>

                  <div>
                    <Muted className="mb-2">Different Sizes</Muted>
                    <div className="flex items-center gap-3">
                      <Code size="small">small</Code>
                      <Code size="default">default</Code>
                      <Code size="large">large</Code>
                    </div>
                  </div>

                  <div className="bg-slate-100 p-4 rounded-lg">
                    <Muted className="mb-2">Technical Documentation Example</Muted>
                    <Paragraph>
                      To customize the primary color, update the{" "}
                      <Code>tailwind.config.ts</Code> file. Set{" "}
                      <Code variant="primary">primary.600</Code> to your brand
                      color like <Code variant="secondary">#2563EB</Code>.
                    </Paragraph>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Components */}
          <section>
            <Heading level="h2" className="mb-6">
              Additional Typography
            </Heading>
            <Card>
              <CardHeader>
                <CardTitle>Utility Components</CardTitle>
                <CardDescription>
                  Lead text, blockquotes, lists, and muted text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Lead Text */}
                  <div>
                    <Muted className="mb-2">Lead Text</Muted>
                    <Lead>
                      This is lead text, perfect for article introductions or
                      hero sections. It&apos;s larger and lighter than body
                      text.
                    </Lead>
                  </div>

                  {/* Blockquote */}
                  <div>
                    <Muted className="mb-2">Blockquote</Muted>
                    <Blockquote>
                      Propertifi transformed how we manage our rental
                      properties. The AI matching found us the perfect property
                      manager in just 48 hours.
                      <footer className="mt-2 text-sm font-medium text-slate-900">
                        — Sarah Johnson, Property Owner
                      </footer>
                    </Blockquote>
                  </div>

                  {/* Unordered List */}
                  <div>
                    <Muted className="mb-2">Unordered List</Muted>
                    <List>
                      <li>AI-powered property manager matching</li>
                      <li>Verified and vetted property managers</li>
                      <li>Compare quotes and services side-by-side</li>
                      <li>Free to use for property owners</li>
                    </List>
                  </div>

                  {/* Ordered List */}
                  <div>
                    <Muted className="mb-2">Ordered List</Muted>
                    <List ordered>
                      <li>Tell us about your property</li>
                      <li>Get matched with top managers</li>
                      <li>Compare and choose the best fit</li>
                      <li>Start managing your property hassle-free</li>
                    </List>
                  </div>

                  {/* Muted Text */}
                  <div>
                    <Muted className="mb-2">Muted Text Example</Muted>
                    <Muted>
                      This is muted text, ideal for less important information,
                      helper text, or captions. It uses a lighter color to
                      de-emphasize content.
                    </Muted>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Real-World Example */}
          <section>
            <Heading level="h2" className="mb-6">
              Real-World Example
            </Heading>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <Heading level="h3">
                    Why Choose Propertifi for Your Rental Property?
                  </Heading>

                  <Lead>
                    Finding the right property manager shouldn&apos;t be
                    complicated. We make it simple.
                  </Lead>

                  <Paragraph variant="large">
                    Our platform connects you with experienced, verified
                    property managers who specialize in your property type and
                    location.
                  </Paragraph>

                  <Heading level="h4">Our Process</Heading>

                  <List ordered>
                    <li>
                      <strong>Share Your Details</strong> - Tell us about your
                      property, location, and management needs
                    </li>
                    <li>
                      <strong>Get Matched</strong> - Our AI analyzes hundreds
                      of property managers to find your best matches
                    </li>
                    <li>
                      <strong>Compare Options</strong> - Review profiles,
                      pricing, and services side-by-side
                    </li>
                    <li>
                      <strong>Make Your Choice</strong> - Select the manager
                      that fits your needs and budget
                    </li>
                  </List>

                  <Blockquote>
                    The best decision I made for my rental properties was using
                    Propertifi. Within a week, I had three excellent candidates
                    to choose from.
                    <footer className="mt-2 text-sm font-medium text-slate-900">
                      — Michael Chen, Multi-Property Owner
                    </footer>
                  </Blockquote>

                  <Paragraph>
                    Ready to get started? Create your free account and get
                    matched with property managers in under 5 minutes. No credit
                    card required.
                  </Paragraph>

                  <Muted>
                    * All property managers are independently verified and must
                    meet our quality standards before being listed on the
                    platform.
                  </Muted>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Typography Scale Reference */}
          <section>
            <Heading level="h2" className="mb-6">
              Typography Scale Reference
            </Heading>
            <Card>
              <CardHeader>
                <CardTitle>Font Families & Usage</CardTitle>
                <CardDescription>
                  Quick reference for Propertifi typography system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <Label className="mb-2">Headings</Label>
                      <Paragraph variant="small">
                        Font: <Code>Plus Jakarta Sans</Code>
                        <br />
                        Weight: <Code>Bold (700)</Code>
                        <br />
                        Usage: All heading levels (H1-H6)
                      </Paragraph>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <Label className="mb-2">Body Text</Label>
                      <Paragraph variant="small">
                        Font: <Code>Inter</Code>
                        <br />
                        Weight: <Code>Regular (400)</Code>
                        <br />
                        Usage: Paragraphs, lists, body content
                      </Paragraph>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Label className="mb-2">Responsive Sizing</Label>
                    <Paragraph variant="small">
                      All typography components use responsive sizing that
                      scales up on larger screens. For example, H1 is{" "}
                      <Code>text-4xl</Code> on mobile, <Code>text-5xl</Code> on
                      tablets, and <Code>text-6xl</Code> on desktop.
                    </Paragraph>
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
