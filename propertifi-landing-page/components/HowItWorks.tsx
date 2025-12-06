import React from 'react';
import { motion } from 'framer-motion';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, stepNumber, index }) => {
  return (
    <motion.div
      className="relative text-center p-8 group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      {/* Connecting Line */}
      {index < 3 && (
        <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-propertifi-orange/30 to-transparent">
          <motion.div
            className="h-full bg-gradient-to-r from-propertifi-orange to-propertifi-blue"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      )}

      {/* Step Number Badge */}
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-propertifi-orange to-propertifi-orange-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {stepNumber}
      </motion.div>

      {/* Icon Container */}
      <motion.div
        className="flex items-center justify-center h-24 w-24 mx-auto bg-gradient-to-br from-propertifi-blue-light to-white rounded-2xl mb-6 shadow-md group-hover:shadow-xl transition-all duration-300 border border-propertifi-blue/10"
        whileHover={{ scale: 1.05, rotate: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-propertifi-blue-dark">{icon}</div>
      </motion.div>

      {/* Content */}
      <h3 className="text-xl md:text-2xl font-bold text-propertifi-gray-900 mb-3 group-hover:text-propertifi-blue transition-colors">
        {title}
      </h3>
      <p className="text-propertifi-gray-500 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Your Property',
      description: 'Select your property type and zip code to get started with personalized matches',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Review Results',
      description: 'Review the results of top local property managers matched to your needs',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Compare Quotes',
      description: 'Select property managers and compare detailed quotes side by side',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Select and Chat',
      description: 'Choose a property manager and start discussing your needs instantly',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 right-10 w-72 h-72 bg-propertifi-blue rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-propertifi-orange rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block bg-propertifi-orange/10 text-propertifi-orange px-4 py-2 rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Simple Process
          </motion.span>

          <h2 className="heading-2 mb-4">
            How Does Propertifi <span className="text-gradient">Work?</span>
          </h2>

          <p className="text-lg md:text-xl text-propertifi-gray-500 max-w-3xl mx-auto leading-relaxed">
            We work tirelessly to find the best Property Managers so you don't have to.
            Get matched with top professionals in just four simple steps.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 mb-16 relative">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepNumber={index + 1}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.a
            href="#"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark hover:from-propertifi-orange-dark hover:to-propertifi-orange text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Now
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>

          <motion.p
            className="mt-6 text-sm text-propertifi-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            No credit card required • Free forever • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
