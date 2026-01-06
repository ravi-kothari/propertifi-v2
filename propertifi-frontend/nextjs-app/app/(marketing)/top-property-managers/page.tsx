"use client";

import { useState, useEffect } from "react";
import { Container, Section } from "@/app/components/layout";
import { Input } from "@/app/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Trophy,
    Medal,
    Award,
    Star,
    MapPin,
    Building2,
    Calendar,
    Home,
    ChevronRight,
    Loader2,
    Search
} from "lucide-react";
import Link from "next/link";
import { calculateTrustScore } from "@/lib/trust-score";
import { TrustScoreBadge } from "@/components/trust-score/TrustScoreBadges";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface LeaderboardManager {
    id: number;
    name: string;
    slug: string;
    city: string;
    state: string;
    years_in_business: string;
    rentals_managed: string;
    bbb_rating: string;
    is_verified: boolean;
    is_featured: boolean;
    logo_url?: string;
    // Computed
    rank?: number;
    trustScore?: number;
    trustRating?: string;
}

const US_STATES = [
    { code: 'ALL', name: 'All States' },
    { code: 'CA', name: 'California' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'NY', name: 'New York' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'CO', name: 'Colorado' },
    { code: 'WA', name: 'Washington' },
    { code: 'GA', name: 'Georgia' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'IL', name: 'Illinois' },
];

const YEARS = [
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
];

export default function TopPropertyManagersPage() {
    const [managers, setManagers] = useState<LeaderboardManager[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState('ALL');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = `${API_BASE_URL}/property-managers?per_page=100&sort_by=bbb_rating&sort_order=desc`;
                if (selectedState && selectedState !== 'ALL') {
                    url += `&state=${selectedState}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }

                const result = await response.json();
                const data = result.data?.data || result.data || [];

                // Calculate trust scores and sort
                const managersWithScores = data.map((manager: any) => {
                    const trustScore = calculateTrustScore({
                        bbb_rating: manager.bbb_rating,
                        years_in_business: manager.years_in_business,
                        rentals_managed: manager.rentals_managed,
                        is_verified: manager.is_verified,
                    });
                    return {
                        ...manager,
                        trustScore: trustScore.score,
                        trustRating: trustScore.rating,
                    };
                });

                // Sort by trust score descending
                managersWithScores.sort((a: any, b: any) => b.trustScore - a.trustScore);

                // Add ranks
                const rankedManagers = managersWithScores.map((m: any, idx: number) => ({
                    ...m,
                    rank: idx + 1,
                }));

                setManagers(rankedManagers.slice(0, 100));
            } catch (err) {
                console.error('Leaderboard fetch error:', err);
                setError('Unable to load leaderboard. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [selectedState, selectedYear]);

    // Filter by search query
    const filteredManagers = managers.filter(m =>
        !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankBadge = (rank: number) => {
        if (rank === 1) {
            return (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
            );
        }
        if (rank === 2) {
            return (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg">
                    <Medal className="w-6 h-6 text-white" />
                </div>
            );
        }
        if (rank === 3) {
            return (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                </div>
            );
        }
        return (
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-bold text-lg">
                {rank}
            </div>
        );
    };

    return (
        <main>
            {/* Hero Section */}
            <Section variant="gradient" spacing="lg">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy className="w-10 h-10 text-yellow-400" />
                            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">
                                Top 100 Property Managers
                            </h1>
                        </div>
                        <p className="text-xl text-slate-200 mb-6">
                            Discover the highest-rated property management companies in the United States,
                            ranked by Propertifi Trust Score.
                        </p>
                        <p className="text-sm text-slate-300">
                            Updated annually based on BBB ratings, years of experience, portfolio size, and verification status.
                        </p>
                    </div>
                </Container>
            </Section>

            {/* Filters */}
            <Section spacing="md" variant="slate">
                <Container>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by company name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-4">
                            {/* State Filter */}
                            <Select value={selectedState} onValueChange={setSelectedState}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent>
                                    {US_STATES.map(state => (
                                        <SelectItem key={state.code} value={state.code}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Year Filter */}
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map(year => (
                                        <SelectItem key={year.value} value={year.value}>
                                            {year.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Leaderboard */}
            <Section spacing="lg">
                <Container>
                    {loading && (
                        <div className="text-center py-12">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">Loading leaderboard...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">⚠️</span>
                            </div>
                            <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
                                Unable to Load
                            </h3>
                            <p className="text-slate-600">{error}</p>
                        </div>
                    )}

                    {!loading && !error && filteredManagers.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
                                No Results Found
                            </h3>
                            <p className="text-slate-600">
                                {searchQuery ? 'Try a different search term' : 'No property managers found for the selected filters.'}
                            </p>
                        </div>
                    )}

                    {!loading && !error && filteredManagers.length > 0 && (
                        <div className="space-y-4">
                            {/* Top 3 Featured Cards */}
                            {filteredManagers.slice(0, 3).length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {filteredManagers.slice(0, 3).map((manager) => (
                                        <Card
                                            key={manager.id}
                                            className={`relative overflow-hidden border-2 ${manager.rank === 1 ? 'border-yellow-400 bg-yellow-50/50' :
                                                manager.rank === 2 ? 'border-gray-300 bg-gray-50/50' :
                                                    'border-amber-600 bg-amber-50/50'
                                                }`}
                                        >
                                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${manager.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                                                manager.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                                                    'bg-gradient-to-r from-amber-600 to-amber-700'
                                                }`} />
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    {getRankBadge(manager.rank!)}
                                                    <TrustScoreBadge
                                                        score={manager.trustScore!}
                                                        rating={manager.trustRating as any}
                                                        size="sm"
                                                    />
                                                </div>
                                                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                                                    {manager.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-slate-600 text-sm mb-4">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{manager.city}, {manager.state}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                                    <div>
                                                        <span className="text-slate-500">Experience:</span>
                                                        <div className="font-semibold">{manager.years_in_business}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500">BBB Rating:</span>
                                                        <div className="font-semibold">{manager.bbb_rating}</div>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/property-managers/${manager.state.toLowerCase()}/${manager.city.toLowerCase().replace(/\s+/g, '-')}/${manager.slug}`}
                                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                                                >
                                                    View Profile <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Remaining Ranked List */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                                    <div className="col-span-1">Rank</div>
                                    <div className="col-span-4">Company</div>
                                    <div className="col-span-2">Location</div>
                                    <div className="col-span-2">Experience</div>
                                    <div className="col-span-1">BBB</div>
                                    <div className="col-span-2">Trust Score</div>
                                </div>
                                {filteredManagers.slice(3).map((manager) => (
                                    <Link
                                        key={manager.id}
                                        href={`/property-managers/${manager.state.toLowerCase()}/${manager.city.toLowerCase().replace(/\s+/g, '-')}/${manager.slug}`}
                                        className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors items-center"
                                    >
                                        <div className="col-span-1">
                                            <span className="font-bold text-slate-700">{manager.rank}</span>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="font-semibold text-slate-900">{manager.name}</div>
                                            {manager.is_verified && (
                                                <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200 mt-1">
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="col-span-2 text-slate-600 text-sm">
                                            {manager.city}, {manager.state}
                                        </div>
                                        <div className="col-span-2 text-slate-600 text-sm">
                                            {manager.years_in_business}
                                        </div>
                                        <div className="col-span-1">
                                            <Badge className={`text-xs ${manager.bbb_rating?.startsWith('A') ? 'bg-green-100 text-green-700' :
                                                manager.bbb_rating?.startsWith('B') ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {manager.bbb_rating || 'N/A'}
                                            </Badge>
                                        </div>
                                        <div className="col-span-2">
                                            <TrustScoreBadge
                                                score={manager.trustScore!}
                                                rating={manager.trustRating as any}
                                                size="sm"
                                                showRating={false}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </Container>
            </Section>

            {/* CTA Section */}
            <Section variant="dark" spacing="lg">
                <Container>
                    <div className="text-center">
                        <h2 className="font-heading text-3xl font-bold mb-4">
                            Ready to Work with a Top-Rated Manager?
                        </h2>
                        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                            Get matched with property managers from our Top 100 list based on your specific needs
                        </p>
                        <Link href="/get-started">
                            <button className="px-8 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors">
                                Get Personalized Matches
                            </button>
                        </Link>
                    </div>
                </Container>
            </Section>
        </main>
    );
}
