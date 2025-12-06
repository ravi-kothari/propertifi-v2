import Hero from '@/app/components/landing/Hero';
import WhyChooseUs from '@/app/components/landing/WhyChooseUs';
import HowItWorks from '@/app/components/landing/HowItWorks';
import PropertyTypes from '@/app/components/landing/PropertyTypes';
import Testimonials from '@/app/components/landing/Testimonials';
import Faq from '@/app/components/landing/Faq';
import News from '@/app/components/landing/News';
import CtaSection from '@/app/components/landing/CtaSection';
import Contact from '@/app/components/landing/Contact';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <PropertyTypes />
      <Testimonials />
      <Faq />
      <News />
      <CtaSection />
      <Contact />
    </>
  );
}
