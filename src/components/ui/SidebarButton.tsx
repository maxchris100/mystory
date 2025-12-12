import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarButtonProps {
  label: string;
  icon: LucideIcon;
  href: string;
  exact?: boolean;
}

export default function SidebarButton({ 
  label, 
  icon: Icon, 
  href = '/',
  exact = false 
}: SidebarButtonProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors',
        isActive 
          ? 'bg-orange-600/75 text-white' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </Link>
  );
}
