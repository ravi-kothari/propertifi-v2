import {
  PMFeeInputs,
  PMFeeResults,
  FeeEstimate,
  MARKET_AVERAGES,
  TYPICAL_SERVICES,
} from '@/types/calculators/pm-fee';

/**
 * Calculate property management fees based on different fee structures
 */
export function calculatePMFees(inputs: PMFeeInputs): PMFeeResults {
  const { propertyType, monthlyRent, numberOfUnits } = inputs;
  
  const totalMonthlyIncome = monthlyRent * numberOfUnits;
  const totalAnnualIncome = totalMonthlyIncome * 12;
  const marketAvgPercentage = MARKET_AVERAGES[propertyType];

  // Generate estimates for different fee structures
  const estimates: FeeEstimate[] = [];

  // 1. Percentage-based fee (market average)
  const percentageFeeAmount = (totalMonthlyIncome * marketAvgPercentage) / 100;
  estimates.push({
    structure: 'percentage',
    percentageFee: marketAvgPercentage,
    monthlyFee: percentageFeeAmount,
    annualFee: percentageFeeAmount * 12,
    description: `${marketAvgPercentage}% of monthly rent - most common structure`,
  });

  // 2. Percentage-based fee (low range)
  const lowPercentage = Math.max(6, marketAvgPercentage - 2);
  const lowPercentageFeeAmount = (totalMonthlyIncome * lowPercentage) / 100;
  estimates.push({
    structure: 'percentage',
    percentageFee: lowPercentage,
    monthlyFee: lowPercentageFeeAmount,
    annualFee: lowPercentageFeeAmount * 12,
    description: `${lowPercentage}% of monthly rent - competitive rate`,
  });

  // 3. Percentage-based fee (high range)
  const highPercentage = Math.min(12, marketAvgPercentage + 2);
  const highPercentageFeeAmount = (totalMonthlyIncome * highPercentage) / 100;
  estimates.push({
    structure: 'percentage',
    percentageFee: highPercentage,
    monthlyFee: highPercentageFeeAmount,
    annualFee: highPercentageFeeAmount * 12,
    description: `${highPercentage}% of monthly rent - premium service`,
  });

  // 4. Flat fee (for multi-family, often used)
  if (numberOfUnits > 1) {
    const flatFeePerUnit = numberOfUnits <= 4 ? 100 : 75; // Economies of scale
    const totalFlatFee = flatFeePerUnit * numberOfUnits;
    estimates.push({
      structure: 'flat',
      flatFee: totalFlatFee,
      monthlyFee: totalFlatFee,
      annualFee: totalFlatFee * 12,
      description: `$${flatFeePerUnit}/unit fixed monthly fee`,
    });
  }

  // 5. Hybrid structure (percentage + flat fee)
  const hybridPercentage = 5;
  const hybridFlatFee = 50;
  const hybridMonthlyFee = (totalMonthlyIncome * hybridPercentage) / 100 + hybridFlatFee;
  estimates.push({
    structure: 'hybrid',
    percentageFee: hybridPercentage,
    flatFee: hybridFlatFee,
    monthlyFee: hybridMonthlyFee,
    annualFee: hybridMonthlyFee * 12,
    description: `${hybridPercentage}% + $${hybridFlatFee} flat fee`,
  });

  // Sort estimates by monthly fee
  estimates.sort((a, b) => a.monthlyFee - b.monthlyFee);

  // Generate recommendations
  const recommendations = generateRecommendations(inputs, percentageFeeAmount, totalMonthlyIncome);

  return {
    estimates,
    marketAverage: {
      percentageFee: marketAvgPercentage,
      monthlyDollarAmount: percentageFeeAmount,
    },
    totalMonthlyIncome,
    totalAnnualIncome,
    recommendations,
    typicalServices: TYPICAL_SERVICES,
  };
}

/**
 * Generate personalized recommendations based on inputs
 */
function generateRecommendations(
  inputs: PMFeeInputs,
  avgFee: number,
  totalIncome: number
): string[] {
  const recommendations: string[] = [];
  const { numberOfUnits, propertyType } = inputs;

  // Recommendation based on units
  if (numberOfUnits === 1) {
    recommendations.push(
      'For single-unit properties, percentage-based fees are most common and align the manager\'s incentives with maximizing your rent.'
    );
  } else if (numberOfUnits >= 2 && numberOfUnits <= 4) {
    recommendations.push(
      'For small multi-family properties, consider negotiating a flat fee per unit, which may save money compared to percentage-based fees.'
    );
  } else {
    recommendations.push(
      'For larger portfolios, you have strong negotiating power. Request volume discounts and consider flat-fee structures.'
    );
  }

  // Recommendation based on fee as % of income
  const feeAsPercentOfIncome = (avgFee / totalIncome) * 100;
  if (feeAsPercentOfIncome > 12) {
    recommendations.push(
      'Management fees above 12% are on the high end. Make sure the services justify the cost.'
    );
  } else if (feeAsPercentOfIncome < 8) {
    recommendations.push(
      'These fees are competitive. Ensure the manager has good reviews and a solid track record.'
    );
  }

  // General recommendations
  recommendations.push(
    'Always ask what services are included vs. what costs extra (e.g., tenant placement, maintenance markups).'
  );
  
  recommendations.push(
    'Review the management contract carefully, especially terms around contract length and cancellation.'
  );

  if (propertyType === 'condo' || propertyType === 'townhouse') {
    recommendations.push(
      'For condos/townhouses, verify the manager has experience with HOA coordination and compliance.'
    );
  }

  return recommendations;
}
