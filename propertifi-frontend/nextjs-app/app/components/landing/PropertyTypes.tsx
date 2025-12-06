'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TypeCardProps {
  icon: string;
  name: string;
  index: number;
}

const TypeCard: React.FC<TypeCardProps> = ({ icon, name, index }) => (
  <motion.div
    className="text-center group cursor-pointer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <motion.div
      className="flex items-center justify-center h-24 w-24 mx-auto bg-gradient-to-br from-propertifi-orange/10 to-propertifi-orange/5 rounded-2xl mb-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-propertifi-orange/20 group-hover:border-propertifi-orange"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-5xl">{icon}</span>
    </motion.div>
    <h3 className="text-base md:text-lg font-bold text-propertifi-gray-700 group-hover:text-propertifi-orange transition-colors">
      {name}
    </h3>
  </motion.div>
);

const PropertyTypes: React.FC = () => {
  const types = [
    { icon: '🏠', name: 'Single Family' },
    { icon: '🏘️', name: 'Small Multi-Family' },
    { icon: '🏢', name: 'Apartments' },
    { icon: '🎓', name: 'Student Housing' },
    { icon: '🏭', name: 'Commercial' },
    { icon: '🏡', name: 'Affordable Housing' },
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-propertifi-blue-light/20 to-transparent"></div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block bg-propertifi-blue/10 text-propertifi-blue px-4 py-2 rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            All Property Types
          </motion.span>

          <h2 className="heading-2 mb-4">
            Property Management for{' '}
            <span className="text-gradient">Every Investment Type</span>
          </h2>

          <p className="text-lg md:text-xl text-propertifi-gray-500 max-w-3xl mx-auto leading-relaxed">
            From single-family homes to large multi-unit complexes, our network offers the perfect manager for your specific property.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {types.map((type, index) => (
            <TypeCard key={type.name} icon={type.icon} name={type.name} index={index} />
          ))}
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.a
            href="/get-started"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark hover:from-propertifi-orange-dark hover:to-propertifi-orange text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>

          <motion.a
            href="#"
            className="inline-flex items-center justify-center gap-3 bg-white border-2 border-propertifi-blue hover:bg-propertifi-blue text-propertifi-blue hover:text-white font-bold py-4 px-10 rounded-full shadow-md hover:shadow-xl transition-all duration-300 text-lg group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            Start Free Trial
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyTypes;
