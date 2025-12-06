import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  imageUrl: string;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col">
    <span className="text-5xl text-propertifi-orange font-serif leading-none">&ldquo;</span>
    <p className="text-propertifi-gray-700 italic flex-grow mb-6">{testimonial.quote}</p>
    <div className="flex items-center">
      <img src={testimonial.imageUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
      <div>
        <p className="font-bold text-propertifi-gray-900">{testimonial.name}</p>
        <p className="text-sm text-propertifi-orange font-semibold">{testimonial.title}</p>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Propertifi saved me from a nightmare! I had been managing my property on my own, but when I got overwhelmed with maintenance and tenant issues, they found me the perfect manager in less than a day.",
      name: 'Alex R.',
      title: '12,00+ Units | Realty Solutions',
      imageUrl: 'https://picsum.photos/id/237/100/100'
    },
    {
      quote: "As a first-time landlord, I was overwhelmed with the process. Propertifi made finding the perfect property manager seamless! Their platform is intuitive and the support is top-notch.",
      name: 'Sarah L.',
      title: '22,00+ Units | Realty Solutions',
      imageUrl: 'https://picsum.photos/id/238/100/100'
    },
    {
      quote: "The quality of property managers on Propertifi is outstanding. We received multiple competitive quotes and were able to choose a manager that perfectly fit our portfolio's needs. Highly recommended!",
      name: 'James M.',
      title: '15,00+ Units | Property Group',
      imageUrl: 'https://picsum.photos/id/239/100/100'
    }
  ];

  return (
    <section className="py-20 bg-propertifi-blue relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background SVG */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="housePattern" patternUnits="userSpaceOnUse" width="400" height="400" >
              <path d="M200 50 L50 150 L50 350 L350 350 L350 150 Z" fill="none" stroke="white" strokeWidth="2" />
              <rect x="100" y="250" width="60" height="100" fill="none" stroke="white" strokeWidth="2" />
              <rect x="240" y="250" width="60" height="60" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#housePattern)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Our Happy Clients</h2>
          <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
            Concise owner quotes paired with hard metrics rather than generic praise to anchor differentiation in results.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
