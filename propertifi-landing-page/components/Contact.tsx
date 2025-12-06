import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="bg-propertifi-blue py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-extrabold">Where to reach us</h2>
            <div className="mt-8 space-y-4">
              <p className="text-2xl font-bold">916-250-1264</p>
              <p className="text-lg text-white/80">Monday - Friday, 9am to 5pm PST</p>
            </div>
            <div className="mt-4">
              <a href="mailto:help@propertifi.co" className="text-2xl font-bold hover:underline">
                help@propertifi.co
              </a>
            </div>
          </div>
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-white font-semibold block mb-2">Your Name</label>
                <input type="text" id="name" name="name" className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-propertifi-orange" />
              </div>
              <div>
                <label htmlFor="email" className="text-white font-semibold block mb-2">Your Email</label>
                <input type="email" id="email" name="email" className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-propertifi-orange" />
              </div>
              <div>
                <label htmlFor="message" className="text-white font-semibold block mb-2">Your Message</label>
                <textarea id="message" name="message" rows={5} className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-propertifi-orange"></textarea>
              </div>
              <div>
                <button type="submit" className="bg-white hover:bg-gray-200 text-propertifi-blue font-bold py-3 px-8 rounded-full transition-colors text-lg">
                  Send a Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
