'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PropertyManager } from '@/lib/mock-data/property-managers';

interface ComparisonContextType {
  comparisonList: PropertyManager[];
  addToComparison: (manager: PropertyManager) => void;
  removeFromComparison: (managerId: string) => void;
  clearComparison: () => void;
  isInComparison: (managerId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<PropertyManager[]>([]);

  const addToComparison = (manager: PropertyManager) => {
    setComparisonList((prev) => {
      // Don't add duplicates
      if (prev.some(m => m.id === manager.id)) {
        return prev;
      }
      // Limit to 3 managers for comparison
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, manager];
    });
  };

  const removeFromComparison = (managerId: string) => {
    setComparisonList((prev) => prev.filter(m => m.id !== managerId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (managerId: string) => {
    return comparisonList.some(m => m.id === managerId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    // Return null during pre-render instead of throwing
    if (typeof window === 'undefined') {
      return null;
    }
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
