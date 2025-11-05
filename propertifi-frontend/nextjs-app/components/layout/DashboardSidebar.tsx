import Link from 'next/link';

export default function DashboardSidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase">Propertifi</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800">
          <Link href="/dashboard/property-manager" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
            Dashboard
          </Link>
        </nav>
      </div>
    </div>
  );
}