'use client';
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-propertifi-gray-800">{question}</span>
        <span className="text-propertifi-orange">{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-propertifi-gray-500">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const Faq: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Basics');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqData = {
    Basics: [
      { q: 'How can I ensure the quality of property managers?', a: 'All managers are vetted. We also ask property managers to keep their information updated so we can effectively match you based on your preferences.' },
      { q: 'Is it free to use Propertifi as a property owner?', a: 'Yes, our service is completely free for property owners. We earn a commission from the property managers when they secure a new contract.' },
    ],
    Company: [
      { q: 'How does Propertifi ensure data security and privacy?', a: 'We use industry-standard encryption and security protocols to protect your data. Your privacy is our top priority.' },
      { q: 'Can I use Propertifi for properties in any location?', a: 'We currently operate in all 50 states within the USA. We are constantly expanding our network of property managers.' },
    ],
    Solutions: [
      { q: 'What if I\'m not satisfied with the property manager?', a: 'We strive for 100% satisfaction. If you are not happy with your match, we will work with you to find a new property manager at no additional cost.' },
      { q: 'Does Propertifi offer property management resources?', a: 'Yes, our blog and resources section offer valuable insights, tips, and guides for property owners on effective property management.' },
    ],
    Features: [
      { q: 'Can I request quotes for specific services, like accounting-only?', a: 'Absolutely. You can specify your exact needs, and we will match you with managers who offer those specific services.' },
      { q:
        'What types of properties can I find management for on Propertifi?', a: 'We cater to a wide range of properties, including single-family homes, multi-family units, apartments, commercial properties, and more.' }
    ],
  };

  const tabs = Object.keys(faqData);
  const currentFaqs = faqData[activeTab as keyof typeof faqData];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-propertifi-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setOpenFaq(0); }}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
                    activeTab === tab
                      ? 'border-propertifi-orange text-propertifi-orange'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {currentFaqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
