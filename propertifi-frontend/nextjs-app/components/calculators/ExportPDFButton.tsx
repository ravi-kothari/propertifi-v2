
"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";

export function ExportPDFButton({ results }: { results: any }) {
  const handleExport = () => {
    if (!results) {
      alert("Please calculate the results first.");
      return;
    }

    const doc = new jsPDF();

    doc.text("ROI Calculator Results", 20, 20);
    doc.text(`Annual ROI: ${(results.annualROI * 100).toFixed(2)}%`, 20, 30);
    doc.text(`Monthly Cash Flow: $${results.monthlyCashFlow.toFixed(2)}`, 20, 40);
    doc.text(`Annual Cash Flow: $${results.annualCashFlow.toFixed(2)}`, 20, 50);
    doc.text(`Cap Rate: ${(results.capRate * 100).toFixed(2)}%`, 20, 60);
    doc.text(`Cash on Cash Return: ${(results.cashOnCashReturn * 100).toFixed(2)}%`, 20, 70);
    doc.text(`Total Investment: $${results.totalInvestment.toFixed(2)}`, 20, 80);

    doc.save("roi-calculator-results.pdf");
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  );
}
