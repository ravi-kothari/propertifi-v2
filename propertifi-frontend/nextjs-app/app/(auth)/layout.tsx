import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicOnlyRoute>
      {children}
    </PublicOnlyRoute>
  );
}
