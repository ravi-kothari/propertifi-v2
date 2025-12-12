import React from 'react';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import Calculators from './components/Calculators';
import PropertyTypes from './components/PropertyTypes';
import Connect from './components/Connect';
import Partners from './components/Partners';
import Testimonials from './components/Testimonials';
import News from './components/News';
import CtaSection from './components/CtaSection';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-white font-sans">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhyChooseUs />
        <Calculators />
        <PropertyTypes />
        <Connect />
        <Partners />
        <Testimonials />
        <News />
        <CtaSection />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
