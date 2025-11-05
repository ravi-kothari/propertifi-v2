
'use client';

import React from 'react';
import ROICalculator from '@/app/components/calculators/ROICalculator';

const ROICalculatorPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">ROI Calculator</h1>
      <ROICalculator />
    </div>
  );
};

export default ROICalculatorPage;
