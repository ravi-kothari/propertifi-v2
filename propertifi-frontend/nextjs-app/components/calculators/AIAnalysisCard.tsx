'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    LightBulbIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface AIAnalysis {
    dealScore: number;
    dealRating: string;
    summary: string;
    strengths: string[];
    concerns: string[];
    suggestions: Array<{
        title: string;
        impact: string;
        change: string;
    }>;
    marketContext: string;
    riskLevel: string;
    keyMetrics: Array<{
        name: string;
        value: string;
        assessment: string;
    }>;
}

interface AIAnalysisCardProps {
    calculatorType: string;
    inputs: Record<string, number | string>;
    results: Record<string, number | string>;
}

export default function AIAnalysisCard({ calculatorType, inputs, results }: AIAnalysisCardProps) {
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
        if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-200';
        if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        return 'text-red-600 bg-red-100 border-red-200';
    };

    const getRatingColor = (rating: string) => {
        const colors: Record<string, string> = {
            Excellent: 'bg-green-500',
            Good: 'bg-blue-500',
            Fair: 'bg-yellow-500',
            Poor: 'bg-red-500',
        };
        return colors[rating] || 'bg-gray-500';
    };

    const getRiskColor = (risk: string) => {
        const colors: Record<string, string> = {
            Low: 'text-green-600',
            Medium: 'text-yellow-600',
            High: 'text-red-600',
        };
        return colors[risk] || 'text-gray-600';
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/analyze-calculator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calculatorType, inputs, results }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAnalysis(data.analysis);
            } else {
                setError(data.error || 'Failed to analyze');
            }
        } catch (err) {
            setError('Failed to connect to analysis service');
        } finally {
            setIsLoading(false);
        }
    };

    if (!analysis && !isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <SparklesIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">AI Deal Analysis</h3>
                            <p className="text-sm text-gray-600">Get expert insights on your investment</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Deal'}
                    </button>
                </div>
                {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
            </motion.div>
        );
    }

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-lg"
            >
                <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="text-gray-600">AI is analyzing your deal...</span>
                </div>
            </motion.div>
        );
    }

    if (!analysis) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
            {/* Header with Score */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6" />
                        <div>
                            <h3 className="font-semibold">AI Deal Analysis</h3>
                            <p className="text-sm text-purple-100">{calculatorType.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} Calculator</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Deal Score */}
                        <div className={`px-4 py-2 rounded-lg border ${getScoreColor(analysis.dealScore)}`}>
                            <div className="text-2xl font-bold">{analysis.dealScore}</div>
                            <div className="text-xs uppercase tracking-wider">Score</div>
                        </div>
                        {/* Rating Badge */}
                        <div className={`px-3 py-1 rounded-full ${getRatingColor(analysis.dealRating)} text-white text-sm font-medium`}>
                            {analysis.dealRating}
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 hover:bg-white/20 rounded"
                        >
                            {isExpanded ? (
                                <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Summary */}
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-700">{analysis.summary}</p>
                                <div className="mt-2 flex items-center gap-4 text-sm">
                                    <span className={`font-medium ${getRiskColor(analysis.riskLevel)}`}>
                                        Risk: {analysis.riskLevel}
                                    </span>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            {analysis.keyMetrics && analysis.keyMetrics.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <ArrowTrendingUpIcon className="h-4 w-4" />
                                        Key Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {analysis.keyMetrics.map((metric, i) => (
                                            <div key={i} className="p-2 bg-gray-50 rounded-lg text-center">
                                                <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
                                                <div className="text-xs text-gray-600">{metric.name}</div>
                                                <div className={`text-xs font-medium ${metric.assessment === 'good' ? 'text-green-600' :
                                                        metric.assessment === 'poor' ? 'text-red-600' : 'text-yellow-600'
                                                    }`}>
                                                    {metric.assessment}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Strengths */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                        Strengths
                                    </h4>
                                    <ul className="space-y-1">
                                        {analysis.strengths.map((strength, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-green-500 mt-1">•</span>
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Concerns */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                                        Concerns
                                    </h4>
                                    <ul className="space-y-1">
                                        {analysis.concerns.map((concern, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-yellow-500 mt-1">•</span>
                                                {concern}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Suggestions */}
                            {analysis.suggestions && analysis.suggestions.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <LightBulbIcon className="h-4 w-4 text-blue-600" />
                                        Improvement Suggestions
                                    </h4>
                                    <div className="space-y-2">
                                        {analysis.suggestions.map((suggestion, i) => (
                                            <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <div className="font-medium text-gray-900">{suggestion.title}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Change:</span> {suggestion.change}
                                                </div>
                                                <div className="text-sm text-blue-700 mt-1">
                                                    <span className="font-medium">Impact:</span> {suggestion.impact}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Market Context */}
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <h4 className="font-medium text-purple-900 mb-1">Market Context</h4>
                                <p className="text-sm text-purple-800">{analysis.marketContext}</p>
                            </div>

                            {/* Re-analyze Button */}
                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isLoading}
                                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                >
                                    ↻ Re-analyze with current values
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
