import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [zipcode, setZipcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', zipcode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 md:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/1920/1080')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-propertifi-blue rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-propertifi-orange rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Headline and CTA */}
          <div className="text-center md:text-left">
            <motion.div variants={itemVariants}>
              <motion.span
                className="inline-block bg-propertifi-orange/20 text-propertifi-orange-light px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-propertifi-orange/30"
                whileHover={{ scale: 1.05 }}
              >
                AI-Powered Matching Technology
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
              variants={itemVariants}
            >
              Property Management Matching,{' '}
              <span className="bg-gradient-to-r from-propertifi-orange via-propertifi-orange-light to-propertifi-blue bg-clip-text text-transparent">
                Simplified
              </span>
              .
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Propertifi uses data-driven insights to connect property owners with top-rated, pre-vetted management professionals in their area.{' '}
              <span className="text-propertifi-orange-light font-semibold">For free.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.a
                href="#"
                className="bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.a>

              <motion.a
                href="#"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg group flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="mr-2 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Watch Demo
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-10 flex items-center justify-center md:justify-start gap-6 text-sm"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-300">4.9/5 Rating</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="text-gray-300">10,000+ Properties Matched</div>
            </motion.div>
          </div>

          {/* Right Column - Lead Form */}
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="glass-dark rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/10"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-propertifi-orange to-propertifi-orange-dark rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Find Your Perfect Match</h2>
                  <p className="text-gray-400 text-sm">In less than 60 seconds</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Tell us what you're looking for and we'll connect you with our network of top property managers in minutes.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="zipcode" className="block text-sm font-medium text-gray-300 mb-2">
                      Enter Your Zip Code
                    </label>
                    <div className="relative">
                      <input
                        id="zipcode"
                        type="text"
                        placeholder="e.g., 94102"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        className="w-full p-4 pr-12 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-propertifi-orange transition-all font-medium"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark hover:from-propertifi-orange-dark hover:to-propertifi-orange text-white font-bold p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Matched Now
                  </motion.button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10">
                <motion.a
                  href="#"
                  className="text-sm text-gray-400 hover:text-propertifi-orange-light font-semibold flex items-center justify-center gap-2 group"
                  whileHover={{ x: 5 }}
                >
                  Advanced Search Options
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
