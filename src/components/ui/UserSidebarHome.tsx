import { usePathname } from "next/navigation";
import { Folder, Star, Clock, Archive, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarButton from "./SidebarButton";

const menuItems = [
  { label: 'All Projects', icon: Folder, path: '/home', exact: true },
  { label: 'Collections', icon: Star, path: '/collections' },
  { label: 'Draft', icon: Clock, path: '/draft' },
  { label: 'Archived', icon: Archive, path: '/archived' },
];

const UserSidebarHome: React.FC<{ currentProfile: { id: string; name: string; email?: string } }> = ({ currentProfile }) => {
  const pathname = usePathname();
  const userInitial = currentProfile?.name?.charAt(0).toUpperCase() || 'U';
  
  return (
    <aside className="fixed left-0 top-0 z-10 flex h-full w-64 flex-col justify-between py-6 px-4">
      {/* User Profile */}
      <div className="mb-4">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-orange-300/20 border-2 border-gray-200 transition-colors cursor-pointer">
          <div className="relative">
            <Avatar className="h-10 w-10" data-slot="avatar">
              <AvatarImage src="/default-avatar.svg" alt={currentProfile?.name} data-slot="avatar-image" />
              <AvatarFallback className="bg-orange-50 text-orange-400" data-slot="avatar-fallback">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-[#2C2C2C]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentProfile?.name || 'User'}</p>
          </div>
          <button 
            className="p-1.5 text-gray-600 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 mt-6">
        {menuItems.map((item) => (
          <div key={item.path} className="relative group">
            <SidebarButton 
              label={item.label}
              icon={item.icon}
              href={item.path}
              exact={item.exact}
            />
            {pathname.startsWith(item.path) && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-orange-500 rounded-r"></span>
            )}
          </div>
        ))}
      </nav> 
    </aside>
  );
};

export default UserSidebarHome;
