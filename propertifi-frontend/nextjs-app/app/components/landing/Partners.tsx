import React from 'react';
import Image from 'next/image';

const PartnerLogo: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <div className="flex justify-center items-center h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
      <img src={src} alt={alt} className="max-h-12 max-w-full" />
    </div>
);

const Partners: React.FC = () => {
  const partners = [
    { src: 'https://via.placeholder.com/150x50.png?text=LEGGETT', alt: 'Leggett International Real Estate' },
    { src: 'https://via.placeholder.com/150x50.png?text=JOHN+TAYLOR', alt: 'John Taylor' },
    { src: 'https://via.placeholder.com/150x50.png?text=KW', alt: 'Keller Williams' },
    { src: 'https://via.placeholder.com/150x50.png?text=AUSTIN', alt: 'Austin Real Estate Experts' },
    { src: 'https://via.placeholder.com/150x50.png?text=RED+OAK', alt: 'Red Oak Realty' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-propertifi-gray-900">Our Partners</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {partners.map((partner, index) => (
            <PartnerLogo key={index} src={partner.src} alt={partner.alt} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
