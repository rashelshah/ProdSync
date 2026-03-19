import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Bell, User, LogOut, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { Link } from 'react-router-dom';

export const TopNavigation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#09090b] px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 text-zinc-400 hover:text-white" />
        <Separator orientation="vertical" className="h-4 bg-zinc-800 hidden md:block" />
        
        {/* Breadcrumb replacement / Title */}
        <div className="hidden md:flex text-sm font-medium text-zinc-400">
          ProdSync Vendor Portal
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center relative w-full max-w-[280px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <Input
            className="h-8 w-full bg-zinc-900 border-zinc-800 pl-8 pr-12 text-xs text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700 shadow-none focus-visible:ring-offset-0"
            placeholder="Search equipment, rentals..."
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
             <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100 sm:flex">
                <Command className="h-3 w-3" />
                <span className="text-xs">K</span>
             </kbd>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="relative h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-[1px] -right-[1px] w-2 h-2 bg-blue-500 rounded-full border-2 border-[#09090b]"></span>
          </Button>

          <Separator orientation="vertical" className="h-4 hidden lg:block bg-zinc-800 mx-1" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-zinc-800">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-zinc-800 text-white text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'V'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{user?.name || 'Vendor'}</p>
                  <p className="text-xs leading-none text-zinc-400">
                    {user?.email || 'vendor@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};