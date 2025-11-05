
import React from 'react';
import Image from 'next/image';

interface LeadCardProps {
  lead: {
    id: string;
    property_address: string;
    status: string;
    created_at: string;
    property_image: string;
  };
  onClick: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer" onClick={onClick}>
      <div className="relative h-48 w-full mb-4">
        <Image
          src={lead.property_image || '/placeholder.png'}
          alt={lead.property_address}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <h3 className="text-lg font-semibold">{lead.property_address}</h3>
      <p className="text-gray-500">Status: {lead.status}</p>
      <p className="text-gray-400 text-sm">Received: {new Date(lead.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default LeadCard;
