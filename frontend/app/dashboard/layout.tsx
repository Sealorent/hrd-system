"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Calendar, LayoutDashboard, ChevronLeft, ChevronRight, NotebookPen, UsersRound, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {logout, user} = useAuth();
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', isAdmin: false },
    { icon: User, label: 'Profile', href: '/dashboard/profile', isAdmin: false },
    { icon: Calendar, label: 'Leave (Cuti)', href: '/dashboard/leave', status: 'Accepted', isAdmin: false },
    { icon: NotebookPen, label: 'Leave Management', href: '/dashboard/leave-management', isAdmin: true },
    { icon: UsersRound, label: 'Employee Management', href: '/dashboard/employee-management', isAdmin: true },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    // Implement logout logic here
    await logout();
    router.push('/login');
    // For example: router.push('/login') or clear session/local storage
  };

  if(!user) {
    return null;
  }
  // Filter menu items based on user role and status
  const filteredMenuItems = menuItems.filter((item) => {
    if (user.isAdmin) {
      return true; // Admins can access all items
    }

    // Non-admin users can access only 'Dashboard' and 'Profile', and 'Leave (Cuti)' if their status is 'Accepted'
    if (!item.isAdmin) {
      if (item.label === 'Leave (Cuti)' && user.status === 'Accepted') {
        return true;
      }
      // Allow 'Dashboard' and 'Profile' for all non-admin users
      if (item.label === 'Dashboard' || item.label === 'Profile') {
        return true;
      }
    }

    return false; // Deny access to other items
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} overflow-y-auto border-r bg-gray-100/40`}>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
              <LayoutDashboard className="h-6 w-6" />
              {!isCollapsed && <span>HR Dashboard</span>}
            </Link>
            <Button variant="ghost" onClick={toggleSidebar} className="ml-auto">
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
            {filteredMenuItems.map((item, index) => (
                <Button
                  key={index}
                  asChild
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {!isCollapsed && item.label}
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className=" mt-10 justify-start hover:bg-red-200"
                onClick={handleLogout}
              > 
                <LogOut className="mr-2 h-4 w-4 " />
                {!isCollapsed && "Logout"}
            </Button>
            </nav>
          </ScrollArea>
          <div className="mt-auto border-t pt-2">
            <Button variant="ghost" onClick={toggleSidebar} className="w-full flex items-center justify-center">
              {isCollapsed ? <ChevronRight /> : null}
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6">
          <Button variant="outline" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">HR Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}