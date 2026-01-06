'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, Clock, Target, Crown, Zap, CheckCircle,
  Sparkles, ArrowRight, Star, MapPin, Timer, ThumbsUp,
  BarChart3, Flame, AlertCircle, ChevronRight, Settings,
  Shield, Award
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

// Types
interface Lead {
  id: number;
  location: string;
  propertyType: string;
  matchScore: number;
  qualityScore: 'hot' | 'warm' | 'cold';
  urgency: string;
  timeRemaining: string;
  isExclusive: boolean;
}

// AI Insight Card
function AIInsightCard({ userName, hotLeads, responseRate, avgResponseRate }: {
  userName?: string;
  hotLeads: number;
  responseRate: number;
  avgResponseRate: number;
}) {
  const isAboveAverage = responseRate > avgResponseRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-orange-500/20 animate-pulse" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-blue-300">AI Insight</span>
        </div>

        <h2 className="text-xl font-bold mb-2">
          Good {getTimeOfDay()}, {userName || 'there'}! 👋
        </h2>

        <p className="text-slate-300 leading-relaxed">
          You have <span className="text-orange-400 font-semibold">{hotLeads} high-quality leads</span> waiting
          for your response. Your response rate is{' '}
          {isAboveAverage ? (
            <span className="text-green-400 font-semibold">{responseRate}% (above average)</span>
          ) : (
            <span className="text-yellow-400 font-semibold">{responseRate}%</span>
          )}
          {isAboveAverage && ' — keep it up!'}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Link href="/property-manager/leads">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
            >
              View Hot Leads <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
          <Link href="/property-manager/insights" className="text-sm text-slate-400 hover:text-white transition-colors">
            View market insights →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// Premium KPI Card with glassmorphism
function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'blue', delay = 0 }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: { value: string; up: boolean };
  color?: 'blue' | 'green' | 'orange' | 'purple';
  delay?: number;
}) {
  const colorStyles = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-600',
    green: 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-600',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-600',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-600',
  };

  const iconBg = {
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    orange: 'bg-orange-500/10 text-orange-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorStyles[color]} backdrop-blur-sm border p-5 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend.up ? 'text-green-600' : 'text-red-500'}`}>
              <TrendingUp className={`h-3 w-3 ${!trend.up && 'rotate-180'}`} />
              {trend.value}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

// Lead Card Component
function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const qualityColors = {
    hot: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    warm: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900',
    cold: 'bg-slate-200 text-slate-700',
  };

  const qualityIcons = {
    hot: Flame,
    warm: ThumbsUp,
    cold: Target,
  };

  const QualityIcon = qualityIcons[lead.qualityScore];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
    >
      {/* Exclusive badge */}
      {lead.isExclusive && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Crown className="h-3 w-3" /> Exclusive
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Match Score Circle */}
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4" fill="none" />
            <circle
              cx="32" cy="32" r="28"
              stroke={lead.matchScore >= 80 ? '#22C55E' : lead.matchScore >= 60 ? '#F59E0B' : '#94A3B8'}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${lead.matchScore * 1.76} 176`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-900">{lead.matchScore}%</span>
          </div>
        </div>

        {/* Lead Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${qualityColors[lead.qualityScore]}`}>
              <QualityIcon className="h-3 w-3" />
              {lead.qualityScore.charAt(0).toUpperCase() + lead.qualityScore.slice(1)}
            </span>
            <span className="text-xs text-slate-500">{lead.propertyType}</span>
          </div>

          <p className="font-semibold text-slate-900 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-slate-400" />
            {lead.location}
          </p>

          {lead.isExclusive && (
            <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
              <Timer className="h-3 w-3" />
              Exclusive for {lead.timeRemaining}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link href={`/property-manager/leads/${lead.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:shadow-md transition-shadow"
            >
              View
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Market Pulse Widget
function MarketPulseWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Market Pulse
        </h3>
        <Link href="/property-manager/insights" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-slate-200">
          <span className="text-sm text-slate-600">New leads in your area</span>
          <span className="font-semibold text-slate-900">24 <span className="text-green-600 text-xs">↑12%</span></span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-slate-200">
          <span className="text-sm text-slate-600">Avg. response time (others)</span>
          <span className="font-semibold text-slate-900">3.2h</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-600">Your Trust Score rank</span>
          <span className="font-semibold text-orange-600 flex items-center gap-1">
            <Award className="h-4 w-4" /> Top 15%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Trust Score Badge
function TrustScoreBadge({ score, tier }: { score: number; tier: string }) {
  const tierConfig: Record<string, { color: string; bgColor: string; icon: any }> = {
    free: { color: 'text-slate-700', bgColor: 'bg-slate-100', icon: Target },
    basic: { color: 'text-blue-700', bgColor: 'bg-blue-100', icon: CheckCircle },
    pro: { color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Zap },
    enterprise: { color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Crown },
  };

  const config = tierConfig[tier.toLowerCase()] || tierConfig.free;
  const TierIcon = config.icon;

  return (
    <div className="flex items-center gap-3">
      {/* Trust Score */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-sm font-semibold text-green-700">Trust Score: {score}</span>
      </div>

      {/* Tier Badge */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor}`}>
        <TierIcon className={`h-4 w-4 ${config.color}`} />
        <span className={`text-sm font-semibold ${config.color}`}>{tier}</span>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function PropertyManagerDashboard() {
  const { user } = useAuth();

  // Mock data - in production this comes from API
  const dashboardData = {
    trustScore: 87,
    tier: 'Pro',
    hotLeads: 5,
    totalLeads: 18,
    responseRate: 92,
    avgResponseRate: 78,
    avgMatchScore: 85,
    leadsConverted: 12,
  };

  const mockLeads: Lead[] = [
    { id: 1, location: 'Austin, TX', propertyType: 'Single Family', matchScore: 95, qualityScore: 'hot', urgency: 'high', timeRemaining: '2h 15m', isExclusive: true },
    { id: 2, location: 'Sacramento, CA', propertyType: 'Multi-Family', matchScore: 88, qualityScore: 'hot', urgency: 'medium', timeRemaining: '4h 30m', isExclusive: true },
    { id: 3, location: 'Denver, CO', propertyType: 'Single Family', matchScore: 76, qualityScore: 'warm', urgency: 'low', timeRemaining: '', isExclusive: false },
    { id: 4, location: 'Phoenix, AZ', propertyType: 'Condo', matchScore: 82, qualityScore: 'warm', urgency: 'medium', timeRemaining: '', isExclusive: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Your AI-powered lead command center</p>
        </div>
        <TrustScoreBadge score={dashboardData.trustScore} tier={dashboardData.tier} />
      </div>

      {/* AI Insight Hero */}
      <AIInsightCard
        userName={user?.name?.split(' ')[0]}
        hotLeads={dashboardData.hotLeads}
        responseRate={dashboardData.responseRate}
        avgResponseRate={dashboardData.avgResponseRate}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Hot Leads"
          value={dashboardData.hotLeads}
          subtitle="AI Score 80%+"
          icon={Flame}
          color="orange"
          trend={{ value: '+3 this week', up: true }}
          delay={0.1}
        />
        <KPICard
          title="Response Rate"
          value={`${dashboardData.responseRate}%`}
          subtitle="Above average"
          icon={Clock}
          color="green"
          trend={{ value: '+5% vs last month', up: true }}
          delay={0.2}
        />
        <KPICard
          title="Leads Converted"
          value={dashboardData.leadsConverted}
          subtitle="This month"
          icon={CheckCircle}
          color="blue"
          trend={{ value: '+2 vs last month', up: true }}
          delay={0.3}
        />
        <KPICard
          title="Avg Match Score"
          value={`${dashboardData.avgMatchScore}%`}
          subtitle="Your lead quality"
          icon={Target}
          color="purple"
          delay={0.4}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
            <Link href="/property-manager/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockLeads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <MarketPulseWidget />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white"
          >
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/property-manager/preferences" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-slate-400" />
                <span className="text-sm">Update Preferences</span>
              </Link>
              <Link href="/property-manager/analytics" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <TrendingUp className="h-5 w-5 text-slate-400" />
                <span className="text-sm">View Analytics</span>
              </Link>
              <Link href="/property-manager/settings" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Shield className="h-5 w-5 text-slate-400" />
                <span className="text-sm">Account Settings</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
