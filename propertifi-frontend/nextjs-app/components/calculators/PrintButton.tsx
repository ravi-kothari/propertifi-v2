
"use client";

import { Button } from "@/components/ui/button";
import { PrinterIcon } from "@heroicons/react/24/outline";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" onClick={handlePrint}>
      <PrinterIcon className="mr-2 h-4 w-4" />
      Print
    </Button>
  );
}
