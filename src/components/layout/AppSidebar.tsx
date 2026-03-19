import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  LayoutDashboard,
  Camera,
  Calendar,
  Film,
  BarChart3,
  Package,
  FileText,
  Clapperboard,
  Box,
  MapPin,
  Fuel,
  Navigation,
  Users,
  Shield,
  User,
  Settings,
  Building2
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Determine role-based prefix and allowed sections
  const role = user?.role || 'producer';
  
  // Producer and Admin have access to everything
  const isFullAccess = role === 'producer' || role === 'admin' || role === 'vendor';
  const isDriver = role === 'driver';
  const isCrew = role === 'camera_crew';

  const prefix = isDriver ? '/driver' : isCrew ? '/crew' : isFullAccess && role === 'vendor' ? '/vendor' : '';

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={prefix + "/dashboard"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-white">
                  <Film className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">ProdSync</span>
                  <span className="truncate text-xs text-zinc-400">
                    {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')} Portal
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* MAIN GROUP */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(prefix + '/dashboard')} tooltip="Dashboard">
                <NavLink to={prefix + "/dashboard"}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {(isFullAccess) && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(prefix + '/inventory')} tooltip="Film Equipment">
                    <NavLink to={prefix + "/inventory"}>
                      <Camera />
                      <span>Film Equipment</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(prefix + '/bookings')} tooltip="Rental Bookings">
                    <NavLink to={prefix + "/bookings"}>
                      <Calendar />
                      <span>Rental Bookings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(prefix + '/orders')} tooltip="Active Rentals">
                    <NavLink to={prefix + "/orders"}>
                      <Film />
                      <span>Active Rentals</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(prefix + '/analytics')} tooltip="Reports & Analytics">
                    <NavLink to={prefix + "/analytics"}>
                      <BarChart3 />
                      <span>Reports & Analytics</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* CAMERA DEPT */}
        {(isFullAccess || isCrew) && (
          <SidebarGroup>
            <SidebarGroupLabel>Camera Dept</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(isCrew ? '/crew/handover' : prefix + '/asset-handover')} tooltip="Asset Handover">
                  <NavLink to={isCrew ? '/crew/handover' : prefix + '/asset-handover'}>
                    <Box />
                    <span>Asset Handover</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(prefix + '/rfq')} tooltip="RFQ Management">
                  <NavLink to={prefix + "/rfq"}>
                    <FileText />
                    <span>RFQ Management</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(isCrew ? '/crew/reports' : prefix + '/camera-reports')} tooltip="Camera Reports">
                  <NavLink to={isCrew ? '/crew/reports' : prefix + '/camera-reports'}>
                    <Clapperboard />
                    <span>Camera Reports</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(prefix + '/expendables')} tooltip="Expendables">
                  <NavLink to={prefix + "/expendables"}>
                    <Package />
                    <span>Expendables</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* TRANSPORT */}
        {(isFullAccess || isDriver) && (
          <SidebarGroup>
            <SidebarGroupLabel>Transport</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(isDriver ? '/driver/trips' : prefix + '/trip-logger')} tooltip="Trip Logger">
                  <NavLink to={isDriver ? '/driver/trips' : prefix + '/trip-logger'}>
                    <Navigation />
                    <span>Trip Logger</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(isDriver ? '/driver/fuel' : prefix + '/fuel-entry')} tooltip="Fuel Entry">
                  <NavLink to={isDriver ? '/driver/fuel' : prefix + '/fuel-entry'}>
                    <Fuel />
                    <span>Fuel Entry</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(prefix + '/geofence')} tooltip="Geofence">
                  <NavLink to={prefix + "/geofence"}>
                    <MapPin />
                    <span>Geofence</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* OPERATIONS */}
        {(isFullAccess) && (
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(prefix + '/service-personnel')} tooltip="Service Personnel">
                  <NavLink to={prefix + "/service-personnel"}>
                    <Users />
                    <span>Service Personnel</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(prefix + '/photo-verification')} tooltip="Photo Verification">
                  <NavLink to={prefix + "/photo-verification"}>
                    <Shield />
                    <span>Photo Verification</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* SETTINGS */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(prefix + '/profile')} tooltip="Profile">
                <NavLink to={prefix + "/profile"}>
                  <User />
                  <span>Profile</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {(isFullAccess) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(prefix + '/settings')} tooltip="Settings">
                  <NavLink to={prefix + "/settings"}>
                    <Settings />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
