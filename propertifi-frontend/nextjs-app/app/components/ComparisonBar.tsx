"use client";

import { useComparison } from "@/app/contexts/ComparisonContext";
import { Button } from "@/components/ui/button";
import { X, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function ComparisonBar() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const router = useRouter();

  if (comparisonList.length === 0) {
    return null;
  }

  const handleCompare = () => {
    router.push("/compare");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Selected Managers */}
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
              Compare ({comparisonList.length}/3):
            </span>
            <div className="flex items-center gap-2">
              {comparisonList.map((manager) => (
                <div
                  key={manager.id}
                  className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 min-w-0"
                >
                  <Building2 className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                    {manager.companyName}
                  </span>
                  <button
                    onClick={() => removeFromComparison(manager.id)}
                    className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                    aria-label={`Remove ${manager.companyName} from comparison`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparison}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCompare}
              disabled={comparisonList.length < 2}
            >
              Compare {comparisonList.length >= 2 ? `(${comparisonList.length})` : ""}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
