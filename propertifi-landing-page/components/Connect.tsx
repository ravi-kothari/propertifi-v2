import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LocationPinIcon } from './icons/LocationPinIcon';

interface StateCardProps {
  name: string;
  index: number;
}

const StateCard: React.FC<StateCardProps> = ({ name, index }) => (
  <motion.div
    className="card group cursor-pointer hover:border-propertifi-orange border-2 border-transparent"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    whileHover={{ y: -5 }}
  >
    <div className="flex flex-col items-center">
      <div className="text-propertifi-blue opacity-20 group-hover:opacity-40 transition-opacity text-6xl mb-2">
        <svg className="w-16 h-16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 L100 25 L80 100 L20 100 L0 25 Z" fill="currentColor"/>
        </svg>
      </div>
      <motion.div
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        <LocationPinIcon className="text-propertifi-orange" />
      </motion.div>
      <span className="font-bold text-propertifi-gray-700 mt-2 group-hover:text-propertifi-orange transition-colors">
        {name}
      </span>
    </div>
  </motion.div>
);

interface PillButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const PillButton: React.FC<PillButtonProps> = ({ label, active, onClick }) => (
  <motion.button
    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
      active
        ? 'bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white shadow-md'
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {label}
  </motion.button>
);

const Connect: React.FC = () => {
  const [activeState, setActiveState] = useState(0);
  const [activeCity, setActiveCity] = useState(0);

  const popularStates = ['Louisiana', 'Texas', 'New Mexico', 'Florida', 'Virginia', 'New York'];
  const statePills = ['AL', 'AK', 'AS', 'AZ', 'AR', 'AA', 'AE', 'AP', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI'];
  const cityPills = ['Auburn', 'Birmingham', 'Mobile', 'Montgomery', 'Huntsville', 'Tuscaloosa'];

  return (
    <section
      className="section-padding bg-gradient-to-b from-propertifi-gray-100 to-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 bg-propertifi-blue rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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
            Nationwide Coverage
          </motion.span>

          <h2 className="heading-2 mb-4">
            Connect with Property Managers{' '}
            <span className="text-gradient">Across USA</span>
          </h2>

          <p className="text-lg text-propertifi-gray-500 max-w-2xl mx-auto">
            Find trusted property management professionals in your area from our network of verified experts
          </p>
        </motion.div>

        {/* Popular States Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {popularStates.map((state, index) => (
            <StateCard key={state} name={state} index={index} />
          ))}
        </div>

        {/* Interactive Map Section */}
        <motion.div
          className="mb-16 card-glass p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-3">
              Explore Property Managers on Map
            </h3>
            <p className="text-propertifi-gray-500">
              Interactive map showing our network of property managers across the country
            </p>
          </div>

          {/* Map Placeholder with Interactive Element */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner h-96 md:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-propertifi-blue opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-propertifi-gray-500 font-medium">
                  Interactive map feature - Coming soon
                </p>
                <p className="text-sm text-propertifi-gray-500 mt-2">
                  Click on any state below to find property managers
                </p>
              </motion.div>
            </div>

            {/* Interactive pins overlay (placeholder) */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-3 h-3 bg-propertifi-orange rounded-full shadow-lg"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-3 h-3 bg-propertifi-blue rounded-full shadow-lg"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-propertifi-orange rounded-full shadow-lg"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, delay: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* State and City Filters */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Find by State */}
          <motion.div
            className="card-glass p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-propertifi-blue to-propertifi-blue-dark rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-propertifi-gray-800">
                Find Property Managers by State
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {statePills.map((state, i) => (
                <PillButton
                  key={state}
                  label={state}
                  active={i === activeState}
                  onClick={() => setActiveState(i)}
                />
              ))}
            </div>

            <div className="text-center">
              <motion.a
                href="#"
                className="font-bold text-propertifi-blue hover:text-propertifi-blue-dark inline-flex items-center gap-2 group"
                whileHover={{ x: 5 }}
              >
                See All States
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Find by City */}
          <motion.div
            className="card-glass p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-propertifi-orange to-propertifi-orange-dark rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-propertifi-gray-800">
                Find Property Managers by City
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {cityPills.map((city, i) => (
                <PillButton
                  key={city}
                  label={city}
                  active={i === activeCity}
                  onClick={() => setActiveCity(i)}
                />
              ))}
            </div>

            <div className="text-center">
              <motion.a
                href="#"
                className="font-bold text-propertifi-orange hover:text-propertifi-orange-dark inline-flex items-center gap-2 group"
                whileHover={{ x: 5 }}
              >
                See All Cities
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Connect;
