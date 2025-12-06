import jsPDF from 'jspdf';
import { CalculatedMetrics, CalculatorState } from '@/types/calculators/roi';

export async function generateROIPDF(
  state: CalculatorState,
  results: CalculatedMetrics
): Promise<void> {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
  const lightGray: [number, number, number] = [243, 244, 246]; // Gray-100
  
  let yPos = 20;
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('ROI Calculator Report', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Propertifi - Property Investment Analysis', 105, 23, { align: 'center' });
  
  yPos = 40;
  doc.setTextColor(...textColor);
  
  // Property Details Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Details', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Purchase Price: $${state.loanDetails.purchasePrice.toLocaleString()}`, 20, yPos);
  doc.text(`Down Payment: $${state.loanDetails.downPayment.toLocaleString()} (${state.loanDetails.downPaymentPercent}%)`, 110, yPos);
  yPos += 6;
  doc.text(`Loan Amount: $${state.loanDetails.loanAmount.toLocaleString()}`, 20, yPos);
  doc.text(`Interest Rate: ${state.loanDetails.interestRate}%`, 110, yPos);
  yPos += 6;
  doc.text(`Loan Term: ${state.loanDetails.loanTerm} years`, 20, yPos);
  doc.text(`Monthly Rent: $${state.income.monthlyRent.toLocaleString()}`, 110, yPos);
  yPos += 12;
  
  // Key Metrics Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Metrics', 20, yPos);
  yPos += 8;
  
  // Create metrics boxes
  const metrics: Array<{label: string; value: string; color: [number, number, number]}> = [
    { label: 'Monthly Cash Flow', value: `$${results.netMonthlyCashFlow.toLocaleString()}`, color: results.netMonthlyCashFlow >= 0 ? [34, 197, 94] : [239, 68, 68] },
    { label: 'Cash-on-Cash Return', value: `${results.cashOnCashReturn.toFixed(2)}%`, color: primaryColor },
    { label: 'Cap Rate', value: `${results.capRate.toFixed(2)}%`, color: primaryColor },
    { label: 'IRR', value: `${results.irr.toFixed(2)}%`, color: primaryColor },
  ];
  
  const boxWidth = 42;
  const boxHeight = 20;
  let xPos = 20;
  
  doc.setFontSize(10);
  metrics.forEach((metric, idx) => {
    if (idx === 2) {
      xPos = 20;
      yPos += boxHeight + 5;
    }
    
    // Box background
    doc.setFillColor(...lightGray);
    doc.rect(xPos, yPos, boxWidth, boxHeight, 'F');
    
    // Label
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(metric.label, xPos + 2, yPos + 5);
    
    // Value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...metric.color);
    doc.setFontSize(14);
    doc.text(metric.value, xPos + 2, yPos + 14);
    doc.setFontSize(10);
    
    xPos += boxWidth + 5;
  });
  
  yPos += boxHeight + 15;
  doc.setTextColor(...textColor);
  
  // Investment Summary
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Summary', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Cash Invested: $${results.totalCashInvested.toLocaleString()}`, 20, yPos);
  yPos += 6;
  doc.text(`Annual Cash Flow: $${results.annualCashFlow.toLocaleString()}`, 20, yPos);
  yPos += 6;
  doc.text(`Annual NOI: $${results.annualNOI.toLocaleString()}`, 20, yPos);
  yPos += 6;
  doc.text(`DSCR: ${results.dscr.toFixed(2)}`, 20, yPos);
  yPos += 12;
  
  // Year-by-Year Projections (First 5 years)
  if (results.yearlyProjections.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('5-Year Projection Summary', 20, yPos);
    yPos += 10;
    
    // Table header
    doc.setFillColor(...primaryColor);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Year', 23, yPos + 5);
    doc.text('Cash Flow', 45, yPos + 5);
    doc.text('NOI', 75, yPos + 5);
    doc.text('Property Value', 95, yPos + 5);
    doc.text('Equity', 135, yPos + 5);
    doc.text('ROI %', 165, yPos + 5);
    yPos += 8;
    
    doc.setTextColor(...textColor);
    const first5Years = results.yearlyProjections.slice(0, 5);
    
    first5Years.forEach((projection, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(...lightGray);
        doc.rect(20, yPos, 170, 7, 'F');
      }
      
      doc.text(projection.year.toString(), 23, yPos + 5);
      doc.text(`$${projection.cashFlow.toLocaleString()}`, 45, yPos + 5);
      doc.text(`$${projection.noi.toLocaleString()}`, 75, yPos + 5);
      doc.text(`$${projection.propertyValue.toLocaleString()}`, 95, yPos + 5);
      doc.text(`$${projection.equity.toLocaleString()}`, 135, yPos + 5);
      doc.text(`${projection.roi.toFixed(1)}%`, 165, yPos + 5);
      yPos += 7;
    });
  }
  
  yPos += 10;
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const footer = 'Generated by Propertifi | This is an estimate. Consult with financial professionals before making investment decisions.';
  doc.text(footer, 105, 285, { align: 'center' });
  
  // Add page numbers if needed
  doc.setTextColor(...textColor);
  doc.text(`Page 1`, 190, 285, { align: 'right' });
  
  // Save the PDF
  const date = new Date().toISOString().split('T')[0];
  doc.save(`ROI-Analysis-${date}.pdf`);
}
