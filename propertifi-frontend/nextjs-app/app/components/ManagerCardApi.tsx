"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Calendar,
    Home,
    DollarSign,
    ExternalLink,
    Phone,
    Star,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { calculateTrustScore, getTrustScoreColor } from "@/lib/trust-score";
import { TrustScoreBadge, VerifiedBadge, RatingBadge } from "@/components/trust-score/TrustScoreBadges";

// Interface matching the API response from Laravel
export interface ApiPropertyManager {
    id: number;
    name: string;
    slug: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
    website?: string;
    description: string;
    years_in_business: string;
    rentals_managed: string;
    bbb_rating: string;
    management_fee: string;
    tenant_placement_fee?: string;
    lease_renewal_fee?: string;
    miscellaneous_fees?: string;
    is_featured: boolean;
    is_verified: boolean;
    logo_url?: string;
    service_types?: string;
}

interface ManagerCardApiProps {
    manager: ApiPropertyManager;
    index?: number;
}

export function ManagerCardApi({ manager, index = 0 }: ManagerCardApiProps) {
    // Parse service types string into array
    const serviceTypes = manager.service_types
        ? manager.service_types.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    // Calculate Trust Score
    const trustScore = calculateTrustScore({
        bbb_rating: manager.bbb_rating,
        years_in_business: manager.years_in_business,
        rentals_managed: manager.rentals_managed,
        is_verified: manager.is_verified,
    });

    // Get BBB rating badge styling
    const getBbbStyle = (rating: string) => {
        if (rating?.startsWith('A')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        if (rating?.startsWith('B')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    };

    const profileUrl = `/property-managers/${manager.state.toLowerCase()}/${manager.city.toLowerCase().replace(/\s+/g, '-')}/${manager.slug}`;

    return (
        <motion.div
            className="group relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.01 }}
        >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-propertifi-blue/5 via-transparent to-propertifi-orange/5 pointer-events-none" />

            {/* Featured badge */}
            {manager.is_featured && (
                <motion.div
                    className="absolute top-4 right-4 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1 px-3 py-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                    </Badge>
                </motion.div>
            )}

            <div className="relative p-6">
                {/* Header with Trust Score */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Trust Score Badge */}
                    <motion.div
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TrustScoreBadge
                            score={trustScore.score}
                            rating={trustScore.rating}
                            size="md"
                        />
                    </motion.div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-propertifi-orange-light transition-colors">
                            {manager.name}
                        </h3>

                        {/* Badges row */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <VerifiedBadge isVerified={manager.is_verified} size="sm" />
                            <RatingBadge rating={trustScore.rating} size="sm" />
                            {manager.bbb_rating && manager.bbb_rating !== 'N/A' && (
                                <Badge className={`${getBbbStyle(manager.bbb_rating)} border text-xs`}>
                                    BBB: {manager.bbb_rating}
                                </Badge>
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 text-propertifi-orange" />
                            <span>{manager.city}, {manager.state}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {manager.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {manager.description}
                    </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-propertifi-blue/20 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-propertifi-blue-light" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Experience</div>
                                <div className="font-semibold text-white text-sm">{manager.years_in_business || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-propertifi-orange/20 flex items-center justify-center">
                                <Home className="w-4 h-4 text-propertifi-orange-light" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Managed</div>
                                <div className="font-semibold text-white text-sm">{manager.rentals_managed || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Types */}
                {serviceTypes.length > 0 && (
                    <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">Property Types</div>
                        <div className="flex flex-wrap gap-2">
                            {serviceTypes.slice(0, 3).map((type) => (
                                <Badge key={type} className="text-xs bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 transition-colors">
                                    {type}
                                </Badge>
                            ))}
                            {serviceTypes.length > 3 && (
                                <Badge className="text-xs bg-propertifi-blue/20 text-propertifi-blue-light border-propertifi-blue/30">
                                    +{serviceTypes.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Management Fee */}
                {manager.management_fee && (
                    <div className="bg-gradient-to-r from-propertifi-orange/10 to-propertifi-blue/10 rounded-xl p-4 mb-4 border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            Management Fee
                        </div>
                        <div className="font-bold text-propertifi-orange-light">{manager.management_fee}</div>
                    </div>
                )}

                {/* CTA Button */}
                <Link href={profileUrl} className="block mb-4">
                    <motion.button
                        className="w-full bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark hover:from-propertifi-orange-dark hover:to-propertifi-orange text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        View Profile
                    </motion.button>
                </Link>

                {/* Contact Info */}
                <div className="flex items-center justify-between text-sm border-t border-white/10 pt-4">
                    {manager.phone && (
                        <a
                            href={`tel:${manager.phone}`}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-propertifi-orange-light transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            {manager.phone}
                        </a>
                    )}
                    {manager.website && (
                        <a
                            href={manager.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-propertifi-blue-light transition-colors"
                        >
                            Visit Website
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>

            {/* Subtle gradient line decoration */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-propertifi-orange via-propertifi-blue to-propertifi-orange"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ transformOrigin: 'left' }}
            />
        </motion.div>
    );
}
