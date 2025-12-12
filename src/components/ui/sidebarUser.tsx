import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const SidebarUserHome: React.FC<{
  label: string;
  link: string;
  icon: React.ReactNode;
}> = ({ label, icon, link = '/' }) => {
  const pathname = usePathname();
  const isActive = pathname === link;
  
  return (
    <Link
      href={link}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-colors',
        isActive 
          ? 'bg-white/10 text-white' 
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
      )}
    >
      <span className={cn(
        'flex items-center justify-center',
        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
      )}>
        {icon}
      </span>
      <span className="text-sm font-medium">
        {label}
      </span>
      {isActive && (
        <span className="ml-auto w-1 h-6 bg-white rounded-l-full"></span>
      )}
    </Link>
  );
};

export default SidebarUserHome;
