"use client";

import { useState } from "react";
import { Section } from "@/app/components/layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/app/components/ui/Input";
import { Search } from "lucide-react";

const faqs = {
  "For Owners": [
    {
      id: "owner-1",
      question: "How does Propertifi work?",
      answer: "Propertifi uses AI-powered matching to connect property owners with qualified property managers. Simply tell us about your property, and we'll analyze hundreds of managers to find the best matches for your specific needs. You can then compare profiles, read reviews, and reach out to managers directly."
    },
    {
      id: "owner-2",
      question: "Is Propertifi free to use?",
      answer: "Yes! Propertifi is completely free for property owners. We don't charge any fees for using our platform to find and connect with property managers. Property managers pay a subscription to be listed on our platform."
    },
    {
      id: "owner-3",
      question: "How are property managers verified?",
      answer: "Every property manager on our platform undergoes a rigorous verification process. We check licenses, credentials, insurance coverage, and references. We also verify their experience, track record, and client reviews to ensure you're only matched with qualified professionals."
    },
    {
      id: "owner-4",
      question: "How long does it take to get matched?",
      answer: "Our AI matching process is instant! Within seconds of completing your property information, you'll receive a list of qualified property managers in your area. You can then take your time reviewing profiles and reaching out to managers."
    },
    {
      id: "owner-5",
      question: "Can I manage multiple properties?",
      answer: "Absolutely! You can add multiple properties to your account and find managers for each one. Our system will match each property with the most suitable managers based on property type, location, and specific requirements."
    },
  ],
  "For Managers": [
    {
      id: "manager-1",
      question: "How do I get listed on Propertifi?",
      answer: "Property managers can apply to join Propertifi by creating a profile and submitting verification documents. Our team reviews each application to ensure all managers meet our quality standards. Once approved, you'll be included in our matching algorithm."
    },
    {
      id: "manager-2",
      question: "What does a Propertifi subscription include?",
      answer: "Your subscription includes a full profile page, inclusion in our AI matching algorithm, lead notifications, analytics dashboard, and priority support. You'll also gain access to property owner inquiries and the ability to showcase your portfolio and reviews."
    },
    {
      id: "manager-3",
      question: "How does the AI matching work?",
      answer: "Our AI analyzes your profile, including property specialties, location coverage, services offered, pricing, and track record. When property owners submit their requirements, the AI matches them with managers who best fit their specific needs."
    },
    {
      id: "manager-4",
      question: "Can I choose which leads I pursue?",
      answer: "Yes! When you're matched with a property owner, you'll receive a notification with details about their property and requirements. You can choose which opportunities to pursue based on your capacity and expertise."
    },
  ],
  "General": [
    {
      id: "general-1",
      question: "What types of properties does Propertifi cover?",
      answer: "Propertifi covers all types of residential and commercial properties, including single-family homes, multi-family buildings, apartments, condos, HOA/COA communities, and commercial properties. Our managers specialize in various property types."
    },
    {
      id: "general-2",
      question: "Which areas does Propertifi serve?",
      answer: "Propertifi operates nationwide across all 50 states. We have property managers in major cities, suburban areas, and rural communities. Simply enter your property location to find managers in your area."
    },
    {
      id: "general-3",
      question: "How do I contact Propertifi support?",
      answer: "You can reach our support team via email at support@propertifi.com, by phone at 1-800-555-1234, or through the contact form on our website. We're available Monday-Friday 9am-6pm PST, and Saturday 10am-4pm PST."
    },
    {
      id: "general-4",
      question: "Is my information secure?",
      answer: "Yes! We take data security very seriously. All information is encrypted and stored securely. We never share your personal information with third parties without your consent. Property managers only see the information you choose to share when connecting with them."
    },
    {
      id: "general-5",
      question: "What if I'm not satisfied with my matches?",
      answer: "If you're not satisfied with your initial matches, you can refine your search criteria or contact our support team for assistance. We're committed to helping you find the perfect property manager for your needs."
    },
  ],
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("For Owners");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search query
  const filteredFaqs = Object.entries(faqs).reduce((acc, [category, questions]) => {
    const filtered = questions.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category as keyof typeof faqs] = filtered;
    }
    return acc;
  }, {} as typeof faqs);

  return (
    <main>
      {/* Hero Section */}
      <Section variant="gradient" spacing="lg">
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
            Find answers to common questions about Propertifi and property management
          </p>
        </div>
      </Section>

      {/* Search and FAQ Content */}
      <Section spacing="lg">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              size="lg"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="For Owners">For Owners</TabsTrigger>
              <TabsTrigger value="For Managers">For Managers</TabsTrigger>
              <TabsTrigger value="General">General</TabsTrigger>
            </TabsList>

            {/* FAQ Accordions */}
            {Object.entries(filteredFaqs).map(([category, questions]) => (
              <TabsContent key={category} value={category}>
                {questions.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left text-lg font-semibold">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-700 text-base leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 text-slate-600">
                    No FAQs found matching "{searchQuery}"
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* No Results Message */}
          {Object.keys(filteredFaqs).length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">
                No FAQs found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Still Have Questions CTA */}
      <Section variant="slate" spacing="lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/contact">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary-600 text-white hover:bg-primary-700 h-11 px-8">
                Contact Support
              </button>
            </a>
            <a href="/blog">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 h-11 px-8">
                Browse Resources
              </button>
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
