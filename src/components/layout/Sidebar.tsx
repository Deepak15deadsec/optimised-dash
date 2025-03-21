
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Home,
  Layers,
  Package,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { state, logout } = useAuth();
  const { user } = state;

  const userNavItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
    { name: 'Reports', icon: <BarChart3 className="h-5 w-5" />, href: '/reports' },
    { name: 'Documents', icon: <FileText className="h-5 w-5" />, href: '/documents' },
  ];

  const adminNavItems = [
    ...userNavItems,
    { name: 'Users', icon: <Users className="h-5 w-5" />, href: '/users' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 ease-in-out transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
          "md:translate-x-0": true,
        }
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Layers className="h-6 w-6 text-sidebar-primary" />
          <span className="text-xl font-semibold">DashboardX</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-3 py-2">
              Menu
            </p>
            
            {/* Main nav items */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    {
                      "bg-sidebar-accent text-sidebar-accent-foreground": isActive,
                      "hover:bg-sidebar-accent/50 text-sidebar-foreground": !isActive,
                    }
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="my-4 h-px bg-sidebar-border"></div>
            
            {/* Support and logout */}
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-3 py-2">
              Support
            </p>
            
            <Link
              to="/help"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent/50"
            >
              <Package className="h-5 w-5" />
              <span>Help Center</span>
            </Link>
            
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* User profile summary */}
        {user && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-sidebar-foreground/60">{user.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
