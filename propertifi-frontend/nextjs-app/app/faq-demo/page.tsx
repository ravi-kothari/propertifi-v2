"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Propertifi?",
    answer: "Propertifi is an AI-powered platform that helps property owners find the perfect property manager for their needs. We use a proprietary algorithm to match you with the best property managers in your area.",
  },
  {
    question: "How does the matching process work?",
    answer: "You tell us about your property and your needs, and our AI algorithm will match you with a list of pre-screened, qualified property managers. You can then compare your options and choose the best fit for you.",
  },
  {
    question: "Is Propertifi free to use?",
    answer: "Yes, Propertifi is completely free for property owners. We make money by charging a small fee to the property managers who use our platform to find new clients.",
  },
  {
    question: "What types of properties do you support?",
    answer: "We support a wide range of properties, including single-family homes, multi-family buildings, HOAs, and commercial properties. No matter what type of property you own, we can help you find the right property manager.",
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Just click the 'Get Started' button on our homepage and answer a few simple questions about your property. We'll take it from there and match you with the best property managers in your area.",
  },
];

export default function FaqDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600">
            Here are some of the most common questions we get from our users.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i + 1}`}>
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-slate-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
