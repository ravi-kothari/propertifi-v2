export interface PropertyManager {
  id: string;
  slug: string;
  companyName: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  featured: boolean;
  verified: boolean;
  yearsExperience: number;
  propertiesManaged: number;

  // Services
  propertyTypes: string[];
  services: string[];

  // Details
  description: string;
  aboutUs: string;
  specialties: string[];
  coverageArea: string[];

  // Pricing
  managementFee: string;
  leaseCommission?: string;

  // Reviews
  reviews: Review[];

  // Portfolio
  portfolio: PortfolioItem[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  propertyType?: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  type: string;
  units: number;
  location: string;
  image?: string;
}

export const mockPropertyManagers: PropertyManager[] = [
  {
    id: "1",
    slug: "premier-property-management",
    companyName: "Premier Property Management",
    rating: 4.8,
    reviewCount: 145,
    address: "1234 Main St, Suite 100",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    zipCode: "90001",
    phone: "(555) 123-4567",
    email: "contact@premierpm.com",
    website: "https://premierpm.com",
    featured: true,
    verified: true,
    yearsExperience: 15,
    propertiesManaged: 450,
    propertyTypes: ["Single Family", "Multi-Family", "Condo"],
    services: [
      "Tenant Screening",
      "Rent Collection",
      "Maintenance Coordination",
      "Financial Reporting",
      "Legal Compliance",
      "Marketing & Leasing"
    ],
    description: "Premier Property Management offers comprehensive property management services across Los Angeles County.",
    aboutUs: "Founded in 2009, Premier Property Management has grown to become one of the most trusted property management companies in Los Angeles. Our team of experienced professionals is dedicated to maximizing your investment returns while providing exceptional service to both owners and tenants.",
    specialties: [
      "Single-family home management",
      "Multi-family complexes",
      "Vacation rental management",
      "HOA management"
    ],
    coverageArea: ["Los Angeles", "Santa Monica", "Beverly Hills", "Pasadena", "Glendale"],
    managementFee: "8% of monthly rent",
    leaseCommission: "50% of first month's rent",
    reviews: [
      {
        id: "r1",
        author: "John D.",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent service! They've been managing my properties for 3 years now and I couldn't be happier. Responsive, professional, and they really care about maintaining good tenant relationships.",
        propertyType: "Single Family"
      },
      {
        id: "r2",
        author: "Sarah M.",
        rating: 5,
        date: "2024-01-10",
        comment: "Premier PM handles everything perfectly. From finding quality tenants to handling maintenance requests, they're on top of it all. Highly recommend!",
        propertyType: "Multi-Family"
      },
      {
        id: "r3",
        author: "Mike R.",
        rating: 4,
        date: "2023-12-20",
        comment: "Great property management company. Very professional and transparent with reporting. Only minor issue was response time during holidays.",
        propertyType: "Condo"
      }
    ],
    portfolio: [
      {
        id: "p1",
        name: "Sunset Gardens Apartments",
        type: "Multi-Family",
        units: 24,
        location: "Los Angeles, CA"
      },
      {
        id: "p2",
        name: "Oak Street Homes",
        type: "Single Family",
        units: 12,
        location: "Santa Monica, CA"
      }
    ]
  },
  {
    id: "2",
    slug: "coastal-realty-management",
    companyName: "Coastal Realty Management",
    rating: 4.9,
    reviewCount: 203,
    address: "5678 Ocean Ave",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    zipCode: "90291",
    phone: "(555) 234-5678",
    email: "info@coastalrealty.com",
    website: "https://coastalrealty.com",
    featured: true,
    verified: true,
    yearsExperience: 20,
    propertiesManaged: 680,
    propertyTypes: ["Single Family", "Multi-Family", "Commercial", "Vacation Rentals"],
    services: [
      "Full-Service Management",
      "Tenant Screening",
      "24/7 Emergency Response",
      "Online Portal Access",
      "Property Inspections",
      "Eviction Services"
    ],
    description: "Coastal Realty Management specializes in beachfront and luxury properties with over 20 years of experience.",
    aboutUs: "With two decades of experience managing premium properties, Coastal Realty Management has built a reputation for excellence in the Los Angeles market. We combine traditional values with modern technology to deliver superior results.",
    specialties: [
      "Luxury property management",
      "Beachfront properties",
      "Short-term vacation rentals",
      "Commercial properties"
    ],
    coverageArea: ["Venice", "Santa Monica", "Malibu", "Manhattan Beach", "Marina del Rey"],
    managementFee: "7% of monthly rent",
    leaseCommission: "One month's rent",
    reviews: [
      {
        id: "r4",
        author: "Lisa K.",
        rating: 5,
        date: "2024-02-01",
        comment: "Outstanding service from start to finish. They found amazing tenants for my beachfront property and handle everything professionally.",
        propertyType: "Single Family"
      },
      {
        id: "r5",
        author: "David P.",
        rating: 5,
        date: "2024-01-25",
        comment: "Best property management company I've worked with. Their attention to detail and communication is excellent.",
        propertyType: "Vacation Rental"
      }
    ],
    portfolio: [
      {
        id: "p3",
        name: "Marina Bay Complex",
        type: "Multi-Family",
        units: 48,
        location: "Marina del Rey, CA"
      },
      {
        id: "p4",
        name: "Venice Beach Collection",
        type: "Vacation Rentals",
        units: 15,
        location: "Venice, CA"
      }
    ]
  },
  {
    id: "3",
    slug: "elite-property-solutions",
    companyName: "Elite Property Solutions",
    rating: 4.7,
    reviewCount: 89,
    address: "9012 Wilshire Blvd",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    zipCode: "90210",
    phone: "(555) 345-6789",
    email: "contact@elitepropertysolutions.com",
    featured: false,
    verified: true,
    yearsExperience: 10,
    propertiesManaged: 280,
    propertyTypes: ["Single Family", "Multi-Family", "HOA/COA"],
    services: [
      "Property Management",
      "Tenant Placement",
      "Rent Collection",
      "Maintenance",
      "Financial Reporting",
      "HOA Management"
    ],
    description: "Elite Property Solutions provides reliable and efficient property management services with a personal touch.",
    aboutUs: "Since 2014, Elite Property Solutions has been helping property owners maximize their investments through professional management and personalized service. We treat every property as if it were our own.",
    specialties: [
      "Residential properties",
      "HOA/COA management",
      "Investment properties",
      "First-time landlords"
    ],
    coverageArea: ["Beverly Hills", "West Hollywood", "Culver City", "Los Angeles"],
    managementFee: "9% of monthly rent",
    leaseCommission: "75% of first month's rent",
    reviews: [
      {
        id: "r6",
        author: "Robert T.",
        rating: 5,
        date: "2024-01-18",
        comment: "Very satisfied with their service. They're responsive and handle issues quickly. Great for first-time property owners.",
        propertyType: "Single Family"
      },
      {
        id: "r7",
        author: "Emma S.",
        rating: 4,
        date: "2024-01-05",
        comment: "Good service overall. They could improve their online portal but the personal service is excellent.",
        propertyType: "Condo"
      }
    ],
    portfolio: [
      {
        id: "p5",
        name: "Beverly Gardens HOA",
        type: "HOA",
        units: 35,
        location: "Beverly Hills, CA"
      }
    ]
  },
  {
    id: "4",
    slug: "metro-management-group",
    companyName: "Metro Management Group",
    rating: 4.6,
    reviewCount: 167,
    address: "3456 Downtown St",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    zipCode: "90013",
    phone: "(555) 456-7890",
    email: "info@metromg.com",
    featured: false,
    verified: true,
    yearsExperience: 12,
    propertiesManaged: 520,
    propertyTypes: ["Multi-Family", "Commercial", "Mixed-Use"],
    services: [
      "Commercial Management",
      "Residential Management",
      "Lease Administration",
      "Tenant Relations",
      "Building Maintenance",
      "Financial Analysis"
    ],
    description: "Metro Management Group specializes in urban properties and mixed-use developments in downtown Los Angeles.",
    aboutUs: "Metro Management Group brings over a decade of experience managing urban properties. Our expertise in commercial and mixed-use developments makes us the go-to choice for downtown property owners.",
    specialties: [
      "Commercial properties",
      "Mixed-use developments",
      "Urban apartments",
      "Retail space management"
    ],
    coverageArea: ["Downtown LA", "Arts District", "Koreatown", "Silver Lake"],
    managementFee: "6% of monthly rent",
    leaseCommission: "One month's rent",
    reviews: [
      {
        id: "r8",
        author: "Tom W.",
        rating: 5,
        date: "2024-02-05",
        comment: "Excellent for commercial properties. They understand the unique needs of retail and office space management.",
        propertyType: "Commercial"
      },
      {
        id: "r9",
        author: "Nancy B.",
        rating: 4,
        date: "2024-01-28",
        comment: "Professional team with good market knowledge. Response times could be faster but overall very satisfied.",
        propertyType: "Multi-Family"
      }
    ],
    portfolio: [
      {
        id: "p6",
        name: "Arts District Lofts",
        type: "Mixed-Use",
        units: 60,
        location: "Downtown LA, CA"
      }
    ]
  },
  {
    id: "5",
    slug: "pacific-property-partners",
    companyName: "Pacific Property Partners",
    rating: 4.5,
    reviewCount: 112,
    address: "7890 Pacific Coast Hwy",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    zipCode: "90402",
    phone: "(555) 567-8901",
    email: "hello@pacificpp.com",
    verified: true,
    featured: false,
    yearsExperience: 8,
    propertiesManaged: 195,
    propertyTypes: ["Single Family", "Condo", "Townhome"],
    services: [
      "Residential Management",
      "Tenant Screening",
      "Maintenance Services",
      "Rent Collection",
      "Property Inspections"
    ],
    description: "Pacific Property Partners offers personalized property management for residential properties throughout LA County.",
    aboutUs: "Pacific Property Partners was founded on the principle that property management should be personal. We focus on building relationships with both owners and tenants to create successful, long-term partnerships.",
    specialties: [
      "Single-family homes",
      "Condominiums",
      "Townhomes",
      "Small portfolios"
    ],
    coverageArea: ["Santa Monica", "Pacific Palisades", "Brentwood"],
    managementFee: "10% of monthly rent",
    leaseCommission: "One month's rent",
    reviews: [
      {
        id: "r10",
        author: "Karen L.",
        rating: 5,
        date: "2024-01-30",
        comment: "Very personal service. They really care about your property and treat it like their own.",
        propertyType: "Single Family"
      },
      {
        id: "r11",
        author: "Steve H.",
        rating: 4,
        date: "2024-01-12",
        comment: "Good communication and reliable service. Pricing is a bit higher but worth it for the quality.",
        propertyType: "Townhome"
      }
    ],
    portfolio: [
      {
        id: "p7",
        name: "Palisades Estates",
        type: "Single Family",
        units: 8,
        location: "Pacific Palisades, CA"
      }
    ]
  },
  {
    id: "6",
    slug: "superior-residential-management",
    companyName: "Superior Residential Management",
    rating: 4.8,
    reviewCount: 178,
    address: "2345 Valley Blvd",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    zipCode: "91367",
    phone: "(555) 678-9012",
    email: "contact@superiorresidential.com",
    featured: false,
    verified: true,
    yearsExperience: 18,
    propertiesManaged: 590,
    propertyTypes: ["Single Family", "Multi-Family", "HOA/COA"],
    services: [
      "Full-Service Management",
      "HOA Management",
      "Tenant Screening",
      "Eviction Services",
      "24/7 Maintenance",
      "Online Payments"
    ],
    description: "Superior Residential Management delivers comprehensive property management services with a focus on customer satisfaction.",
    aboutUs: "With nearly two decades of experience, Superior Residential Management has earned a reputation for reliability and excellence. Our comprehensive approach ensures your property is well-maintained and profitable.",
    specialties: [
      "Large portfolios",
      "HOA management",
      "Multi-family complexes",
      "Affordable housing"
    ],
    coverageArea: ["San Fernando Valley", "Woodland Hills", "Encino", "Sherman Oaks", "Van Nuys"],
    managementFee: "7.5% of monthly rent",
    leaseCommission: "75% of first month's rent",
    reviews: [
      {
        id: "r12",
        author: "Patricia G.",
        rating: 5,
        date: "2024-02-03",
        comment: "They've been managing our HOA for 5 years. Professional, organized, and always available when we need them.",
        propertyType: "HOA"
      },
      {
        id: "r13",
        author: "James C.",
        rating: 5,
        date: "2024-01-22",
        comment: "Great experience with Superior. They filled my vacancy quickly with a quality tenant and handle everything smoothly.",
        propertyType: "Multi-Family"
      }
    ],
    portfolio: [
      {
        id: "p8",
        name: "Valley View Apartments",
        type: "Multi-Family",
        units: 72,
        location: "Woodland Hills, CA"
      },
      {
        id: "p9",
        name: "Encino Heights HOA",
        type: "HOA",
        units: 45,
        location: "Encino, CA"
      }
    ]
  }
];

// Helper function to get managers by location
export function getManagersByLocation(state: string, city: string): PropertyManager[] {
  return mockPropertyManagers.filter(
    manager =>
      manager.stateCode.toLowerCase() === state.toLowerCase() &&
      manager.city.toLowerCase() === city.toLowerCase()
  );
}

// Helper function to get manager by slug
export function getManagerBySlug(slug: string): PropertyManager | undefined {
  return mockPropertyManagers.find(manager => manager.slug === slug);
}

// Get all unique services
export function getAllServices(): string[] {
  const servicesSet = new Set<string>();
  mockPropertyManagers.forEach(manager => {
    manager.services.forEach(service => servicesSet.add(service));
  });
  return Array.from(servicesSet).sort();
}

// Get all unique property types
export function getAllPropertyTypes(): string[] {
  const typesSet = new Set<string>();
  mockPropertyManagers.forEach(manager => {
    manager.propertyTypes.forEach(type => typesSet.add(type));
  });
  return Array.from(typesSet).sort();
}
