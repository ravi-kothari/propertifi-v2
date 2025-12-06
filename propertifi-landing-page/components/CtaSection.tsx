import React from 'react';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-propertifi-blue rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="relative h-64 md:h-full">
                <img 
                    src="https://picsum.photos/id/1074/800/600" 
                    alt="Hands holding a model house" 
                    className="w-full h-full object-cover"
                />
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
