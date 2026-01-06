'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Award, Star } from 'lucide-react';
import { TrustScoreResult, getTrustScoreColor } from '@/lib/trust-score';

interface TrustScoreBadgeProps {
    score: number;
    rating: TrustScoreResult['rating'];
    size?: 'sm' | 'md' | 'lg';
    showRating?: boolean;
}

/**
 * Trust Score Badge Component
 * Displays the Propertifi Trust Score with color-coded styling
 */
export function TrustScoreBadge({
    score,
    rating,
    size = 'md',
    showRating = true
}: TrustScoreBadgeProps) {
    const colors = getTrustScoreColor(score);

    const sizeClasses = {
        sm: 'w-10 h-10 text-sm',
        md: 'w-14 h-14 text-lg',
        lg: 'w-20 h-20 text-2xl',
    };

    const ratingIcons = {
        'Elite': Award,
        'Excellent': Star,
        'Good': CheckCircle2,
        'Fair': Shield,
        'New': Shield,
    };

    // Define gradient colors for inline styles (Tailwind purges dynamic classes)
    const gradientStyles: Record<string, string> = {
        'from-purple-600 to-indigo-600': 'linear-gradient(to bottom right, #9333ea, #4f46e5)',
        'from-green-600 to-emerald-600': 'linear-gradient(to bottom right, #16a34a, #059669)',
        'from-blue-600 to-cyan-600': 'linear-gradient(to bottom right, #2563eb, #0891b2)',
        'from-yellow-600 to-orange-600': 'linear-gradient(to bottom right, #ca8a04, #ea580c)',
        'from-gray-500 to-gray-600': 'linear-gradient(to bottom right, #6b7280, #4b5563)',
    };

    const Icon = ratingIcons[rating];
    const gradientStyle = gradientStyles[colors.gradient] || gradientStyles['from-gray-500 to-gray-600'];

    return (
        <div className="flex flex-col items-center gap-1">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                style={{ background: gradientStyle }}
            >
                {score}
            </motion.div>
            {showRating && (
                <div className={`flex items-center gap-1 text-xs font-medium ${colors.text}`}>
                    <Icon className="w-3 h-3" />
                    <span>{rating}</span>
                </div>
            )}
        </div>
    );
}

interface VerifiedBadgeProps {
    isVerified: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Propertifi Verified Badge
 * Shows verification status for property managers
 */
export function VerifiedBadge({ isVerified, size = 'md' }: VerifiedBadgeProps) {
    if (!isVerified) return null;

    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    return (
        <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} bg-blue-100 text-blue-700 border border-blue-200 rounded-full font-medium`}>
            <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span>Verified</span>
        </span>
    );
}

interface EliteBadgeProps {
    rating: TrustScoreResult['rating'];
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Elite/Rating Badge
 * Shows the PM's rating tier based on Trust Score
 */
export function RatingBadge({ rating, size = 'md' }: EliteBadgeProps) {
    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    const badgeStyles: Record<TrustScoreResult['rating'], string> = {
        'Elite': 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
        'Excellent': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
        'Good': 'bg-blue-100 text-blue-700 border border-blue-200',
        'Fair': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        'New': 'bg-gray-100 text-gray-600 border border-gray-200',
    };

    const icons: Record<TrustScoreResult['rating'], React.ReactNode> = {
        'Elite': <Award className="w-3 h-3" />,
        'Excellent': <Star className="w-3 h-3" />,
        'Good': <CheckCircle2 className="w-3 h-3" />,
        'Fair': null,
        'New': null,
    };

    return (
        <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${badgeStyles[rating]} rounded-full font-medium`}>
            {icons[rating]}
            <span>{rating}</span>
        </span>
    );
}

interface TrustScoreBreakdownProps {
    breakdown: TrustScoreResult['breakdown'];
}

/**
 * Trust Score Breakdown Component
 * Shows the individual components that make up the Trust Score
 */
export function TrustScoreBreakdown({ breakdown }: TrustScoreBreakdownProps) {
    const categories = [
        { label: 'Trust', value: breakdown.trust, max: 35, color: 'bg-blue-500' },
        { label: 'Experience', value: breakdown.experience, max: 35, color: 'bg-green-500' },
        { label: 'Performance', value: breakdown.performance, max: 30, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Score Breakdown</h4>
            <div className="space-y-1.5">
                {categories.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">{cat.label}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(cat.value / cat.max) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={`h-full ${cat.color} rounded-full`}
                            />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8">{cat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
