'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils'; // gunakan util cn dari shadcn
import authService from '../../../services/auth';
import { useState } from 'react';

const menuItems = (userId: string) => ([
    { label: 'Design 3D', href: `/design/${userId}-project` },
    { label: 'Estimation RAB', href: `/${userId}/rab` },
    { label: 'Building Nearby', href: `/${userId}/nearby` },
]);

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const pathParts = pathname.split('/').filter(Boolean);
    const userId = pathParts[0] || '1';
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            // Panggil logout service untuk hapus token/cookie
            await authService.logout();

            // Bersihkan localStorage jika ada data tambahan
            localStorage.removeItem('sessionUuid');
            localStorage.removeItem('user');

            // Redirect ke halaman login
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="w-64 min-h-screen border-r bg-white">
            <div>
                <Link href={`/${userId}/home`}>
                    <div className="flex items-center gap-3 p-6">
                        <img src="/logo.png" alt="Renqar" className="h-8 w-8 rounded-md" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold">Renqar</span>
                            <span className="text-xs text-muted-foreground">Build smarter</span>
                        </div>
                    </div>
                </Link>
                <div className="px-4">
                    <div className="h-px w-full bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <nav className="px-2 py-3 space-y-1">
                    {menuItems(userId).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'block rounded-md px-4 py-2 text-sm transition-all hover:bg-primary/10',
                                pathname === item.href && 'border-l-4 border-primary bg-primary/15 font-semibold'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="px-2 py-4 border-t">
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full text-left rounded-md px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                >
                    {loading ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </aside>
    );
}
