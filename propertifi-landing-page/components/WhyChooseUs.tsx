import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => (
  <motion.div
    className="glass-dark text-white p-8 rounded-2xl shadow-glass hover:shadow-glass-hover h-full flex flex-col group border border-white/10"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -8, scale: 1.02 }}
  >
    <motion.div
      className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-propertifi-orange to-propertifi-orange-dark rounded-xl flex items-center justify-center shadow-lg"
      whileHover={{ rotate: 12, scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="scale-90">{icon}</div>
    </motion.div>

    <div className="mt-6 flex-grow">
      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-propertifi-orange-light transition-colors">
        {title}
      </h3>
      <p className="text-gray-200 leading-relaxed">{description}</p>
    </div>

    {/* Decorative gradient line */}
    <motion.div
      className="mt-6 h-1 bg-gradient-to-r from-propertifi-orange to-transparent rounded-full"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
      style={{ transformOrigin: 'left' }}
    />
  </motion.div>
);

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      title: 'Intelligent Matching',
      description: 'Our AI-driven platform quickly connects you with vetted property managers tailored to your specific property and needs.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Customizable Solutions',
      description: 'Define your criteria and receive personalized quotes and management proposals that align with your unique investment goals.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Professionals',
      description: 'Connect with a network of pre-screened, experienced property managers who provide expert guidance every step of the way.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Transparent & Streamlined',
      description: 'Experience clear communication and a simplified process for finding and engaging your ideal property manager.',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Background with subtle static accents - cleaner without animated orbs */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-propertifi-blue/5 via-transparent to-propertifi-orange/5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-propertifi-blue rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-propertifi-orange rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block bg-propertifi-blue/20 text-propertifi-blue-light px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm border border-propertifi-blue/30"
            whileHover={{ scale: 1.05 }}
          >
            Why Propertifi
          </motion.span>

          <h2 className="heading-2 text-white mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-propertifi-orange via-propertifi-orange-light to-propertifi-blue bg-clip-text text-transparent">
              Us?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We work tirelessly to find the best Property Managers so you don't have to. Here's what makes Propertifi the smarter choice.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 pt-16 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <motion.div
                className="text-4xl md:text-5xl font-extrabold mb-2 text-gradient"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                10K+
              </motion.div>
              <div className="text-gray-300 text-sm md:text-base">Properties Matched</div>
            </div>

            <div className="text-white">
              <motion.div
                className="text-4xl md:text-5xl font-extrabold mb-2 text-gradient"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                500+
              </motion.div>
              <div className="text-gray-300 text-sm md:text-base">Verified Managers</div>
            </div>

            <div className="text-white">
              <motion.div
                className="text-4xl md:text-5xl font-extrabold mb-2 text-gradient"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                4.9
              </motion.div>
              <div className="text-gray-300 text-sm md:text-base">Average Rating</div>
            </div>

            <div className="text-white">
              <motion.div
                className="text-4xl md:text-5xl font-extrabold mb-2 text-gradient"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                50+
              </motion.div>
              <div className="text-gray-300 text-sm md:text-base">States Covered</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
