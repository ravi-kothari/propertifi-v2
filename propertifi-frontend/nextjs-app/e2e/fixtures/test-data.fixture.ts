/**
 * Test Data Fixtures for E2E Tests
 * 
 * Provides pre-configured test data for various scenarios
 */

import { TestDataGenerator } from '../utils/test-data-generator';

export const testUsers = {
  propertyManager: TestDataGenerator.generateUser('property_manager'),
  owner: TestDataGenerator.generateUser('owner'),
  admin: TestDataGenerator.generateUser('admin'),
};

export const testLeads = {
  singleFamily: TestDataGenerator.generateLead({
    property_type: 'single_family',
    number_of_units: 1,
  }),
  multiFamily: TestDataGenerator.generateLead({
    property_type: 'multi_family',
    number_of_units: 10,
  }),
  commercial: TestDataGenerator.generateLead({
    property_type: 'commercial',
    number_of_units: 5,
  }),
};

export const sampleLeads = TestDataGenerator.generateLeads(5);









