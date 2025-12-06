import {
  RentEstimateInputs,
  RentEstimateResults,
  RentComparable,
  BASE_RENT_MATRIX,
  CONDITION_MULTIPLIERS,
  AMENITY_VALUES,
} from '@/types/calculators/rent-estimate';

/**
 * Calculate estimated rent based on property details
 * Note: This uses a simplified model. In production, you'd integrate with
 * real rental data APIs like Rentometer, Zillow, or your own database
 */
export function calculateRentEstimate(inputs: RentEstimateInputs): RentEstimateResults {
  const {
    propertyType,
    bedrooms,
    bathrooms,
    squareFeet,
    condition,
    amenities,
    address,
  } = inputs;

  // Get base rent for property type and bedroom count
  const bedroomCount = Math.min(Math.max(bedrooms, 1), 5);
  let baseRent = BASE_RENT_MATRIX[propertyType][bedroomCount] || 1500;

  // Apply location multiplier (simplified - in production use real market data)
  const locationMultiplier = getLocationMultiplier(address.state, address.city);
  baseRent *= locationMultiplier;

  // Apply condition multiplier
  const conditionMultiplier = CONDITION_MULTIPLIERS[condition];
  baseRent *= conditionMultiplier;

  // Add bathroom premium (0.5 bath = +2%, full bath = +5%)
  const extraBaths = Math.max(bathrooms - bedrooms, 0);
  const bathroomPremium = extraBaths * 0.05;
  baseRent *= (1 + bathroomPremium);

  // Adjust for square footage
  const avgSqftPerBed = 500;
  const expectedSqft = bedroomCount * avgSqftPerBed;
  const sqftRatio = squareFeet / expectedSqft;
  const sqftAdjustment = (sqftRatio - 1) * 0.15; // 15% adjustment per deviation
  baseRent *= (1 + sqftAdjustment);

  // Add amenity values
  let amenityTotal = 0;
  Object.entries(amenities).forEach(([amenity, hasIt]) => {
    if (hasIt && amenity in AMENITY_VALUES) {
      amenityTotal += AMENITY_VALUES[amenity as keyof typeof AMENITY_VALUES];
    }
  });
  baseRent += amenityTotal;

  // Calculate range (±10% for mid estimate)
  const midRent = Math.round(baseRent);
  const lowRent = Math.round(baseRent * 0.90);
  const highRent = Math.round(baseRent * 1.10);

  // Calculate price per sqft
  const pricePerSqft = {
    low: parseFloat((lowRent / squareFeet).toFixed(2)),
    mid: parseFloat((midRent / squareFeet).toFixed(2)),
    high: parseFloat((highRent / squareFeet).toFixed(2)),
  };

  // Generate mock comparables (in production, fetch real data)
  const comparables = generateComparables(inputs, midRent);

  // Market trends (mock data - in production use real market data)
  const marketTrends = {
    yoyChange: getMarketTrend(address.state),
    trend: getMarketTrend(address.state) > 2 ? 'rising' as const : 
           getMarketTrend(address.state) < -2 ? 'declining' as const : 'stable' as const,
    medianRent: midRent,
  };

  // Generate recommendations
  const recommendations = generateRecommendations(inputs, midRent, marketTrends);

  // Calculate confidence based on data quality
  const confidence = calculateConfidence(inputs);

  return {
    estimatedRent: {
      low: lowRent,
      mid: midRent,
      high: highRent,
    },
    pricePerSqft,
    marketTrends,
    comparables,
    recommendations,
    confidence,
  };
}

/**
 * Get location multiplier based on state and city
 * Simplified version - in production, use real market data
 */
function getLocationMultiplier(state: string, city: string): number {
  // High-cost states
  const highCostStates = ['CA', 'NY', 'MA', 'WA', 'HI'];
  const midCostStates = ['TX', 'FL', 'CO', 'NC', 'GA'];
  
  if (highCostStates.includes(state.toUpperCase())) {
    return 1.4;
  } else if (midCostStates.includes(state.toUpperCase())) {
    return 1.1;
  }
  return 1.0;
}

/**
 * Get market trend for location
 */
function getMarketTrend(state: string): number {
  // Simplified - in production use real market data
  const growthStates = ['TX', 'FL', 'NC', 'TN', 'AZ'];
  const declineStates = ['IL', 'NY', 'CA'];
  
  if (growthStates.includes(state.toUpperCase())) {
    return 5.2; // 5.2% YoY growth
  } else if (declineStates.includes(state.toUpperCase())) {
    return -1.5; // -1.5% YoY decline
  }
  return 2.5; // Stable/modest growth
}

/**
 * Generate mock comparable properties
 * In production, fetch real rental listings from MLS or rental APIs
 */
function generateComparables(
  inputs: RentEstimateInputs,
  estimatedRent: number
): RentComparable[] {
  const { bedrooms, bathrooms, squareFeet } = inputs;
  
  const comps: RentComparable[] = [];
  
  // Generate 5 comparable properties
  for (let i = 0; i < 5; i++) {
    const variance = 0.85 + (Math.random() * 0.3); // ±15% variance
    const bedVariance = Math.floor(Math.random() * 2) - 1; // -1, 0, or +1
    const sqftVariance = Math.floor((Math.random() - 0.5) * 300);
    
    comps.push({
      address: `${Math.floor(Math.random() * 9000) + 1000} ${['Oak', 'Maple', 'Pine', 'Elm', 'Cedar'][i]} St`,
      beds: Math.max(1, bedrooms + bedVariance),
      baths: bathrooms + (Math.random() > 0.5 ? 0.5 : 0),
      sqft: squareFeet + sqftVariance,
      rent: Math.round(estimatedRent * variance),
      distance: parseFloat((Math.random() * 2 + 0.1).toFixed(1)),
      similarity: Math.round(85 + Math.random() * 10),
    });
  }
  
  // Sort by similarity
  comps.sort((a, b) => b.similarity - a.similarity);
  
  return comps;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  inputs: RentEstimateInputs,
  estimatedRent: number,
  marketTrends: any
): string[] {
  const recommendations: string[] = [];
  const { amenities, condition, squareFeet, bedrooms } = inputs;

  // Condition-based recommendations
  if (condition === 'fair' || condition === 'poor') {
    recommendations.push(
      `Consider renovations to improve condition. Upgrading from '${condition}' to 'good' could increase rent by ${Math.round(estimatedRent * 0.10)} - ${Math.round(estimatedRent * 0.15)}/month.`
    );
  }

  // Amenity recommendations
  const missingHighValueAmenities = [];
  if (!amenities.parking) missingHighValueAmenities.push('parking (+\/mo)');
  if (!amenities.updatedKitchen) missingHighValueAmenities.push('updated kitchen (+\/mo)');
  if (!amenities.laundry) missingHighValueAmenities.push('in-unit laundry (+\/mo)');
  
  if (missingHighValueAmenities.length > 0) {
    recommendations.push(
      `High-value amenities to consider: ${missingHighValueAmenities.join(', ')}.`
    );
  }

  // Market trend recommendations
  if (marketTrends.trend === 'rising') {
    recommendations.push(
      `Market rents are rising ${marketTrends.yoyChange.toFixed(1)}% year-over-year. Consider pricing at the higher end of the range.`
    );
  } else if (marketTrends.trend === 'declining') {
    recommendations.push(
      `Market is soft with rents declining ${Math.abs(marketTrends.yoyChange).toFixed(1)}% YoY. Price competitively to minimize vacancy.`
    );
  }

  // Size recommendations
  const sqftPerBed = squareFeet / bedrooms;
  if (sqftPerBed > 600) {
    recommendations.push(
      'Your property is spacious for its bedroom count. Emphasize square footage in marketing.'
    );
  } else if (sqftPerBed < 400) {
    recommendations.push(
      'Property is compact for its bedroom count. Focus on location and amenities in marketing.'
    );
  }

  // General recommendation
  recommendations.push(
    'Get a professional rental analysis from a local property manager for the most accurate estimate.'
  );

  return recommendations;
}

/**
 * Calculate confidence score based on data completeness
 */
function calculateConfidence(inputs: RentEstimateInputs): number {
  let confidence = 50; // Base confidence
  
  // Boost confidence for complete address
  if (inputs.address.city && inputs.address.state && inputs.address.zipCode) {
    confidence += 20;
  }
  
  // Boost for realistic square footage
  if (inputs.squareFeet > 0 && inputs.squareFeet < 10000) {
    confidence += 15;
  }
  
  // Boost for standard bed/bath counts
  if (inputs.bedrooms >= 1 && inputs.bedrooms <= 5) {
    confidence += 10;
  }
  
  // Cap at 85% (would be higher with real comp data)
  return Math.min(confidence, 85);
}
