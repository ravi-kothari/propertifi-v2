/**
 * Test Data Generator for E2E Tests
 * 
 * Provides utilities to generate test data for users, leads, and other entities
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: 'property_manager' | 'owner' | 'admin';
  type?: string;
}

export interface TestLead {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  property_type: string;
  number_of_units: number;
}

export class TestDataGenerator {
  /**
   * Generate a unique email address for testing
   */
  static generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}@test.propertifi.com`;
  }

  /**
   * Generate test user data
   */
  static generateUser(role: 'property_manager' | 'owner' | 'admin' = 'property_manager'): TestUser {
    const email = this.generateEmail(role);
    return {
      email,
      password: 'TestPassword123!',
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} Test User`,
      role,
      type: role === 'property_manager' ? 'pm' : role === 'owner' ? 'owner' : 'admin',
    };
  }

  /**
   * Generate test lead data
   */
  static generateLead(overrides?: Partial<TestLead>): TestLead {
    const cities = ['Los Angeles', 'New York', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['CA', 'NY', 'IL', 'TX', 'AZ'];
    const propertyTypes = ['single_family', 'multi_family', 'commercial', 'association'];
    
    const randomIndex = Math.floor(Math.random() * cities.length);
    
    return {
      name: `Test Lead ${Date.now()}`,
      email: this.generateEmail('lead'),
      phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Test Street`,
      city: cities[randomIndex],
      state: states[randomIndex],
      zipcode: `${Math.floor(Math.random() * 90000) + 10000}`,
      property_type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      number_of_units: Math.floor(Math.random() * 20) + 1,
      ...overrides,
    };
  }

  /**
   * Generate multiple test leads
   */
  static generateLeads(count: number): TestLead[] {
    return Array.from({ length: count }, () => this.generateLead());
  }

  /**
   * Generate response data for lead responses
   */
  static generateContactInfoResponse() {
    return {
      type: 'contact_info',
      phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
      email: this.generateEmail('contact'),
    };
  }

  static generateScheduleViewingResponse() {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
    
    return {
      type: 'schedule_viewing',
      preferred_date: date.toISOString().split('T')[0],
      preferred_time: ['09:00', '12:00', '15:00', '18:00'][Math.floor(Math.random() * 4)],
      message: 'Would like to schedule a viewing',
    };
  }

  static generatePriceQuoteResponse() {
    return {
      type: 'price_quote',
      amount: (Math.random() * 500 + 200).toFixed(2),
      frequency: 'monthly',
      services: ['Property Management', 'Maintenance', 'Tenant Screening'],
      message: 'Please see our competitive pricing',
    };
  }

  static generateDeclineResponse() {
    return {
      type: 'decline',
      message: 'Thank you for considering us, but we are not able to take on this property at this time.',
    };
  }
}









