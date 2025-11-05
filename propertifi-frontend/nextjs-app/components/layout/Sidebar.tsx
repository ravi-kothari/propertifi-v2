'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Building2,
  Calendar,
  Mail,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/property-manager',
    icon: Home,
  },
  {
    name: 'Leads',
    href: '/property-manager/leads',
    icon: Users,
  },
  {
    name: 'Properties',
    href: '/property-manager/properties',
    icon: Building2,
  },
  {
    name: 'Calendar',
    href: '/property-manager/calendar',
    icon: Calendar,
  },
  {
    name: 'Inbox',
    href: '/property-manager/inbox',
    icon: Mail,
  },
  {
    name: 'Analytics',
    href: '/property-manager/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/property-manager/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <Link href="/property-manager" className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">Propertifi</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-indigo-700')} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile (at bottom) */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              PM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Property Manager
              </p>
              <p className="text-xs text-gray-500 truncate">
                Premium Tier
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
