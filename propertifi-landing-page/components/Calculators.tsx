import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CalculatorCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ title, icon, description, isActive, onClick }) => (
  <motion.div
    className={`relative p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${isActive
        ? 'bg-gradient-to-br from-propertifi-blue to-blue-600 text-white border-transparent shadow-xl'
        : 'bg-white border-gray-100 hover:border-propertifi-blue/30 hover:shadow-lg'
      }`}
    onClick={onClick}
    whileHover={{ y: -5 }}
    layout
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-white/20' : 'bg-blue-50 text-propertifi-blue'
      }`}>
      {icon}
    </div>
    <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{description}</p>
  </motion.div>
);

const RoiCalculator: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [monthlyRent, setMonthlyRent] = useState(3500);
  const [expenses, setExpenses] = useState(1200);

  const annualIncome = monthlyRent * 12;
  const annualExpenses = expenses * 12;
  const noi = annualIncome - annualExpenses;
  const capRate = ((noi / purchasePrice) * 100).toFixed(2);
  const annualCashFlow = noi; // Simplified (assuming no mortgage for pure NOI calc, or user puts full P&I in expenses)
  const totalInvestment = downPayment;
  // Cash on Cash = Annual Pre-Tax Cash Flow / Total Cash Invested
  const cashOnCash = totalInvestment > 0 ? ((annualCashFlow / totalInvestment) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Expenses</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="mb-1 text-gray-400 font-medium text-sm">Cap Rate</div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-propertifi-orange to-yellow-400 bg-clip-text text-transparent">
                {capRate}%
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="mb-1 text-gray-400 font-medium text-sm">Cash on Cash</div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {cashOnCash}%
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">Monthly Cash Flow</div>
              <div className="text-xl font-bold text-green-400">+${(noi / 12).toFixed(0)}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">Annual NOI</div>
              <div className="text-lg font-bold text-white">${noi.toLocaleString()}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">Total Investment</div>
              <div className="text-lg font-bold text-white">${totalInvestment.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MortgageCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(5000); // Annual
  const [homeInsurance, setHomeInsurance] = useState(1500); // Annual

  const principal = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Mortgage Payment Formula: M = P [i(1+i)^n] / [(1+i)^n - 1]
  const monthlyPrincipalAndInterest =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const monthlyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Years)</label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax / Year</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(Number(e.target.value))}
                  className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
          <div className="mb-2 text-gray-400 font-medium">Estimated Monthly Payment</div>
          <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ${totalMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-6 w-full pt-6 border-t border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Principal & Interest</span>
              <span className="font-bold">${monthlyPrincipalAndInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Property Tax</span>
              <span className="font-bold">${monthlyTax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Home Insurance</span>
              <span className="font-bold">${monthlyInsurance.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RentVsBuyCalculator: React.FC = () => {
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [homePrice, setHomePrice] = useState(500000);
  const [years, setYears] = useState(5);
  const [homeAppreciation, setHomeAppreciation] = useState(3); // Annual %
  const [rentIncrease, setRentIncrease] = useState(2); // Annual %

  // Simplify assumptions
  const downPayment = homePrice * 0.20;
  const loanAmount = homePrice - downPayment;
  const interestRate = 6.5; // Fixed assumption
  const monthlyRate = interestRate / 100 / 12;
  const loanTermMonths = 30 * 12;

  // Calculate Buying Costs
  const monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  const monthlyPropertyTax = (homePrice * 0.01) / 12; // 1% annual tax
  const monthlyMaintenance = (homePrice * 0.01) / 12; // 1% annual maintenance
  const monthlyInsurance = 100;

  const totalMonthlyBuyCost = monthlyMortgage + monthlyPropertyTax + monthlyMaintenance + monthlyInsurance;
  const totalBuyCostOverPeriod = (totalMonthlyBuyCost * 12 * years) + downPayment;

  // Calculate Ending Home Value
  const futureHomeValue = homePrice * Math.pow(1 + (homeAppreciation / 100), years);
  const remainingPrincipal = loanAmount * Math.pow(1 + monthlyRate, years * 12) - (monthlyMortgage * (Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate); // Simplified approx

  // Actually, accurately remaining principal is tricky without iteration, use simple approximation for equity
  // Or just totalBuyCost - (futureHomeValue - initialLoanAmount)?
  // Let's use: Net Cost of Buying = Total Out of Pocket - Equity Gained
  // Equity = Future Value - Remaining Loan Balance

  // Better approximation for Remaining Balance:
  // B = L[ (1+c)^n - (1+c)^p ] / [ (1+c)^n - 1 ]
  // L = loan amount, c = monthly rate, n = total months, p = months elapsed
  const p = years * 12;
  const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, loanTermMonths) - Math.pow(1 + monthlyRate, p)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

  const equity = futureHomeValue - remainingBalance;
  const netBuyCost = totalBuyCostOverPeriod - equity;

  // Calculate Renting Costs
  let totalRentCost = 0;
  let currentMonthlyRent = monthlyRent;
  for (let i = 0; i < years; i++) {
    totalRentCost += currentMonthlyRent * 12;
    currentMonthlyRent *= (1 + (rentIncrease / 100));
  }
  // Subtract opportunity cost? (Investment of down payment)
  const investmentReturnRate = 0.05; // 5% annual return on invested down payment
  const investmentGains = downPayment * Math.pow(1 + investmentReturnRate, years) - downPayment;
  const netRentCost = totalRentCost - investmentGains;

  const difference = netBuyCost - netRentCost;
  const isBuyingCheaper = difference < 0;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full pl-8 p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
            <input
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-sm text-gray-500 mt-1">{years} Years</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Home Appreciation (%)</label>
              <input
                type="number"
                step="0.1"
                value={homeAppreciation}
                onChange={(e) => setHomeAppreciation(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent Increase (%)</label>
              <input
                type="number"
                step="0.1"
                value={rentIncrease}
                onChange={(e) => setRentIncrease(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-propertifi-blue outline-none"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
          <div className="mb-2 text-gray-400 font-medium">Over {years} Years</div>
          <div className={`text-4xl font-extrabold bg-clip-text text-transparent ${isBuyingCheaper ? 'bg-gradient-to-r from-green-400 to-emerald-300' : 'bg-gradient-to-r from-blue-400 to-indigo-300'}`}>
            {isBuyingCheaper ? 'Buying' : 'Renting'} is Cheaper
          </div>
          <div className="text-sm text-gray-400 mt-1">
            by ${Math.abs(difference).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>

          <div className="mt-6 w-full pt-6 border-t border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Net Cost to Buy</span>
              <span className="font-bold">${netBuyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Net Cost to Rent</span>
              <span className="font-bold">${netRentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Equity Gained</span>
              <span className="font-bold text-green-400">+${equity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roi' | 'mortgage' | 'rent'>('roi');

  return (
    <section id="calculators" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="text-propertifi-blue font-bold tracking-wider uppercase text-sm mb-2 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Financial Tools
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Smart Calculators for Smart Investors
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Make data-driven decisions with our suite of real estate investment calculators.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Calculator Selection */}
          <div className="lg:col-span-4 space-y-4">
            <CalculatorCard
              title="ROI Calculator"
              description="Calculate Return on Investment and Cap Rate for rental properties."
              isActive={activeTab === 'roi'}
              onClick={() => setActiveTab('roi')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <CalculatorCard
              title="Mortgage Calculator"
              description="Estimate monthly payments including interest, taxes, and insurance."
              isActive={activeTab === 'mortgage'}
              onClick={() => setActiveTab('mortgage')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <CalculatorCard
              title="Rent vs. Buy"
              description="Compare the financial impact of renting versus buying a home."
              isActive={activeTab === 'rent'}
              onClick={() => setActiveTab('rent')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
            />
          </div>

          {/* Active Calculator Area */}
          <div className="lg:col-span-8">
            <motion.div
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'roi' && (
                  <motion.div
                    key="roi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900">Return on Investment Calculator</h3>
                      <p className="text-gray-500 mt-1">Analyze the potential profitability of an investment property.</p>
                    </div>
                    <RoiCalculator />
                  </motion.div>
                )}
                {activeTab === 'mortgage' && (
                  <motion.div
                    key="mortgage"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900">Mortgage Payment Calculator</h3>
                      <p className="text-gray-500 mt-1">Estimate your monthly mortgage payments and amortization.</p>
                    </div>
                    <MortgageCalculator />
                  </motion.div>
                )}
                {activeTab === 'rent' && (
                  <motion.div
                    key="rent"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900">Rent vs. Buy Calculator</h3>
                      <p className="text-gray-500 mt-1">Determine if it makes more financial sense to rent or buy.</p>
                    </div>
                    <RentVsBuyCalculator />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* New CTA Section */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Want to save your calculations?</h3>
            <p className="text-gray-600">
              Sign up for a free Propertifi account to save your analyses, export PDF reports, and unlock more advanced tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://propertifi.somakaaya.com/public/calculators"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-propertifi-blue font-bold rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap"
            >
              View All Calculators
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-propertifi-orange text-white font-bold rounded-xl shadow-md hover:bg-propertifi-orange-dark transition-colors flex items-center justify-center whitespace-nowrap"
            >
              Sign Up Free
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Calculators;
