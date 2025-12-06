/**
 * Upgrade Banner Component
 * Shows premium tier benefits to free tier users
 */

import { Crown, Zap, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface UpgradeBannerProps {
  tier: string;
  missedLeadsCount?: number;
}

export function UpgradeBanner({ tier, missedLeadsCount = 0 }: UpgradeBannerProps) {
  // Only show for free tier
  if (tier !== 'free') return null;

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-6 w-6 text-amber-300" />
              <h3 className="text-xl font-bold text-white">
                Upgrade to Pro or Enterprise
              </h3>
            </div>

            {/* Missed Leads Alert */}
            {missedLeadsCount > 0 && (
              <div className="mb-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-300" />
                <span className="text-white font-semibold">
                  You missed {missedLeadsCount} lead{missedLeadsCount !== 1 ? 's' : ''} this month due to premium exclusivity
                </span>
              </div>
            )}

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
                  <Zap className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Early Access</p>
                  <p className="text-purple-100 text-xs mt-1">
                    Get leads 24-48 hours before free tier
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">More Leads</p>
                  <p className="text-purple-100 text-xs mt-1">
                    30-100 leads/month vs 3 on free tier
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Priority Support</p>
                  <p className="text-purple-100 text-xs mt-1">
                    Get help faster with dedicated support
                  </p>
                </div>
              </div>
            </div>

            {/* Tier Comparison */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-purple-200 text-xs mb-1">Free Tier</p>
                  <p className="text-white font-bold text-lg">3 leads/mo</p>
                  <p className="text-purple-200 text-xs">No priority</p>
                </div>
                <div className="border-x border-white/20">
                  <p className="text-purple-200 text-xs mb-1">Pro Tier</p>
                  <p className="text-amber-300 font-bold text-lg">30 leads/mo</p>
                  <p className="text-amber-200 text-xs">24h exclusive</p>
                </div>
                <div>
                  <p className="text-purple-200 text-xs mb-1">Enterprise</p>
                  <p className="text-amber-300 font-bold text-lg">100 leads/mo</p>
                  <p className="text-amber-200 text-xs">48h exclusive</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="ml-6 flex-shrink-0">
            <Link href="/property-manager/settings?tab=subscription">
              <Button
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg"
                size="lg"
              >
                Upgrade Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
