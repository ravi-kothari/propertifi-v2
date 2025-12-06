import React from 'react';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-propertifi-blue rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="relative h-64 md:h-full bg-gradient-to-br from-propertifi-blue-dark to-propertifi-blue flex items-center justify-center">
                <svg className="w-48 h-48 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <div className="p-8 md:p-12 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Property Management Solutions You Can Count On
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Find the best property managers for all property types.
              </p>
              <div className="mt-8">
                <a href="#" className="bg-white hover:bg-gray-200 text-propertifi-blue font-bold py-3 px-8 rounded-full transition-colors text-lg inline-block">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
