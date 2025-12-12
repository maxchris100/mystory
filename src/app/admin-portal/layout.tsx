'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { QueryProvider } from '@/components/ui/QueryProvider';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const value = localStorage.getItem('admin_Renqar');
    const ok = value === 'admin_ganteng_123456';
    setAllowed(ok);
    if (!ok) {
      router.replace('/');
    }
  }, [router]);

  const navItems = useMemo(
    () => [
      { href: '/admin-portal/projects', label: 'Project' },
      { href: '/admin-portal/materials', label: 'Material' },
      { href: '/admin-portal/plans', label: 'Plan' },
      { href: '/admin-portal/partners', label: 'Partners' },
      { href: '/admin-portal/users', label: 'Users' },
      { href: '/admin-portal/waiting-lists', label: 'Waiting List' },
    ],
    []
  );

  if (allowed === null) {
    return <div className="p-6">Memeriksa akses...</div>;
  }
  if (!allowed) return null;

  return (
    <div className="min-h-screen w-full flex">
      <aside className="w-56 border-r bg-card/40">
        <div className="p-4 font-semibold">Admin Portal</div>
        <nav className="flex flex-col">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 hover:bg-accent transition ${active ? 'bg-accent font-semibold' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 space-y-4">
        <QueryProvider>
          {children}
        </QueryProvider>
      </main>
    </div>
  );
}

