'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  FileText,
  Settings,
  Building2,
  UserCog,
  GitBranch,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Roles & Permissions',
    href: '/admin/roles',
    icon: Shield,
  },
  {
    title: 'Property Managers',
    href: '/admin/property-managers',
    icon: Building2,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Leads',
    href: '/admin/leads',
    icon: FileText,
  },
  {
    title: 'Lead Assignments',
    href: '/admin/lead-assignments',
    icon: GitBranch,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-gray-900/50 border-b border-gray-700">
        <Link href="/admin" className="flex items-center space-x-2">
          <UserCog className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              )}
            >
              <Icon className={cn('h-5 w-5 mr-3', isActive ? 'text-white' : 'text-gray-400')} />
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-700/50 rounded-lg">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">Super Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
