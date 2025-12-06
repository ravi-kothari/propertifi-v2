import {
  RehabInputs,
  RehabResults,
  CostBreakdown,
  COST_MATRIX,
  STRUCTURAL_COSTS,
} from '@/types/calculators/rehab';

/**
 * Calculate rehab costs based on scope and quality
 */
export function calculateRehabCost(inputs: RehabInputs): RehabResults {
  const { propertySquareFeet, rooms, structural, location } = inputs;
  
  const breakdown: CostBreakdown[] = [];
  let totalLow = 0;
  let totalMid = 0;
  let totalHigh = 0;
  let estimatedDays = 0;

  // Calculate room-by-room costs
  rooms.forEach((room, idx) => {
    const costs = COST_MATRIX[room.scope][room.quality];
    const roomLow = room.squareFeet * costs.min;
    const roomHigh = room.squareFeet * costs.max;
    const roomMid = (roomLow + roomHigh) / 2;

    const laborPercent = 0.6; // Labor is typically 60% of total
    const materialPercent = 0.4;

    breakdown.push({
      category: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} - ${room.scope}`,
      laborCost: roomMid * laborPercent,
      materialCost: roomMid * materialPercent,
      totalCost: roomMid,
      description: `${room.squareFeet} sqft ${room.quality} finish`,
    });

    totalLow += roomLow;
    totalMid += roomMid;
    totalHigh += roomHigh;

    // Add to timeline
    const daysPerRoom = room.scope === 'cosmetic' ? 3 : 
                        room.scope === 'moderate' ? 7 :
                        room.scope === 'extensive' ? 14 : 21;
    estimatedDays += daysPerRoom;
  });

  // Calculate structural costs
  Object.entries(structural).forEach(([system, needed]) => {
    if (needed && system in STRUCTURAL_COSTS) {
      const costs = STRUCTURAL_COSTS[system as keyof typeof STRUCTURAL_COSTS];
      
      let systemCost = 0;
      if ('flat' in costs && costs.flat) {
        systemCost = (costs.min + costs.max) / 2;
      } else if ('perSqft' in costs && costs.perSqft) {
        systemCost = propertySquareFeet * costs.perSqft;
      } else if ('perWindow' in costs && costs.perWindow) {
        const estimatedWindows = Math.floor(propertySquareFeet / 200); // Rough estimate
        systemCost = estimatedWindows * ((costs.min + costs.max) / 2);
      }

      breakdown.push({
        category: system.charAt(0).toUpperCase() + system.slice(1) + ' Replacement',
        laborCost: systemCost * 0.5,
        materialCost: systemCost * 0.5,
        totalCost: systemCost,
        description: 'Major system upgrade',
      });

      totalLow += costs.min;
      totalMid += systemCost;
      totalHigh += costs.max;

      // Add to timeline
      estimatedDays += system === 'roof' || system === 'siding' ? 5 :
                       system === 'foundation' ? 14 : 3;
    }
  });

  // Apply location multiplier
  const locationMultiplier = getLocationMultiplier(location.state);
  totalLow *= locationMultiplier;
  totalMid *= locationMultiplier;
  totalHigh *= locationMultiplier;

  // Calculate contingency (15% of total)
  const contingency = totalMid * 0.15;

  // Calculate cost per sqft
  const costPerSqft = {
    low: parseFloat((totalLow / propertySquareFeet).toFixed(2)),
    mid: parseFloat((totalMid / propertySquareFeet).toFixed(2)),
    high: parseFloat((totalHigh / propertySquareFeet).toFixed(2)),
  };

  // Generate recommendations
  const recommendations = generateRecommendations(inputs, totalMid, estimatedDays);

  return {
    totalCost: {
      low: Math.round(totalLow),
      mid: Math.round(totalMid),
      high: Math.round(totalHigh),
    },
    costPerSqft,
    breakdown,
    timeline: {
      estimatedDays,
      estimatedWeeks: Math.ceil(estimatedDays / 7),
    },
    recommendations,
    contingency: Math.round(contingency),
  };
}

/**
 * Get location cost multiplier
 */
function getLocationMultiplier(state: string): number {
  const highCostStates = ['CA', 'NY', 'MA', 'WA', 'HI'];
  const midCostStates = ['TX', 'FL', 'CO', 'NC', 'GA'];
  
  if (highCostStates.includes(state.toUpperCase())) {
    return 1.3;
  } else if (midCostStates.includes(state.toUpperCase())) {
    return 1.05;
  }
  return 1.0;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  inputs: RehabInputs,
  totalCost: number,
  days: number
): string[] {
  const recommendations: string[] = [];
  const { rooms, structural, propertySquareFeet } = inputs;

  // Budget recommendations
  const costPerSqft = totalCost / propertySquareFeet;
  if (costPerSqft > 150) {
    recommendations.push(
      `At $${costPerSqft.toFixed(0)}/sqft, this is a high-cost rehab. Verify your ARV (After Repair Value) supports this investment.`
    );
  }

  // Timeline recommendations
  if (days > 90) {
    recommendations.push(
      `Estimated timeline of ${Math.ceil(days / 7)} weeks is extensive. Consider holding costs and financing implications.`
    );
  }

  // Scope recommendations
  const hasGutRehab = rooms.some(r => r.scope === 'gut-rehab');
  if (hasGutRehab) {
    recommendations.push(
      'Gut rehabs often uncover hidden issues. Budget an additional 20-25% contingency for unexpected repairs.'
    );
  }

  // Structural recommendations
  const structuralCount = Object.values(structural).filter(v => v).length;
  if (structuralCount >= 2) {
    recommendations.push(
      `You're replacing ${structuralCount} major systems. Get multiple contractor bids and verify permits are included.`
    );
  }

  // Quality recommendations
  const hasLuxury = rooms.some(r => r.quality === 'luxury');
  if (hasLuxury) {
    recommendations.push(
      'Luxury finishes require skilled labor. Verify contractors have experience with high-end installations.'
    );
  }

  // General recommendations
  recommendations.push(
    'Always add 10-20% contingency for unexpected issues discovered during renovation.'
  );
  
  recommendations.push(
    'Get at least 3 contractor bids and verify licensing, insurance, and references.'
  );

  if (totalCost > 50000) {
    recommendations.push(
      'For projects over $50k, consider hiring a project manager or general contractor to coordinate trades.'
    );
  }

  return recommendations;
}
