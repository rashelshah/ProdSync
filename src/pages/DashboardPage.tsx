import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Film, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RootState } from '@/store/store';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

const departmentSummary = [
  { name: 'Camera Department', activeUsers: 12, equipment: 45, utilization: '82%' },
  { name: 'Transport & Logistics', activeUsers: 8, equipment: 15, utilization: '74%' },
  { name: 'Lighting', activeUsers: 5, equipment: 28, utilization: '68%' },
  { name: 'Audio', activeUsers: 3, equipment: 12, utilization: '91%' },
];

const recentBookings = [
  { id: '1', equipment: 'Canon EOS R5 + RF 24-70mm', customer: 'Mumbai Film Productions', date: '2024-01-15', status: 'confirmed', amount: '₹18,500' },
  { id: '2', equipment: 'ARRI SkyPanel S60-C Kit', customer: 'Creative Studios Delhi', date: '2024-01-16', status: 'pending', amount: '₹13,500' },
  { id: '3', equipment: 'Sony FX30 + DJI Ronin RS3', customer: 'Bangalore Documentary Co.', date: '2024-01-17', status: 'completed', amount: '₹28,000' },
  { id: '4', equipment: 'RED Komodo 6K Set', customer: 'Indie Films', date: '2024-01-18', status: 'confirmed', amount: '₹45,000' },
];

const alerts = [
  { id: '1', message: 'Canon RF 85mm lens needs cleaning service', type: 'warning', time: '2 hours ago' },
  { id: '2', message: 'New rental request for Sony A7S III camera', type: 'info', time: '4 hours ago' },
  { id: '3', message: 'Payment received from Mumbai Film Productions', type: 'success', time: '6 hours ago' },
  { id: '4', message: 'Vehicle MH-01-AB-1234 scheduled for maintenance', type: 'warning', time: '5 hours ago' },
];

export const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const navigate = useNavigate();

  const activeRentalsCount = bookings.filter(
    b => b.status === 'confirmed' || b.status === 'pending'
  ).length || 24; // fallback for display

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-emerald-500/20">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 shadow-none border-amber-500/20">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 shadow-none border-blue-500/20">Completed</Badge>;
      default:
        return <Badge variant="outline" className="text-zinc-400 border-zinc-700">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 lg:p-6 lg:pt-0 w-full max-w-7xl mx-auto">
      {/* 4 Block Cards matching Image exactly but with app data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Total Revenue */}
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">₹1,85,430</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Trending up this month <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Revenue for the last 6 months
            </p>
          </CardContent>
        </Card>

        {/* Active Rentals */}
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Rentals</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +4
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{activeRentalsCount}</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Steady booking pipeline <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Equipment currently on rent
            </p>
          </CardContent>
        </Card>

        {/* Film Equipment */}
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Equipment</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +8%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">127</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Inventory growing <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Total items available to rent
            </p>
          </CardContent>
        </Card>

        {/* Utilization */}
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Utilization Rate</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              -2%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">78%</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Down slightly this period <ArrowDownRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Overall equipment utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart Block */}
      <div className="mt-2">
        <ChartAreaInteractive />
      </div>

      {/* Recent Rentals and Alerts Split */}
      <div className="grid gap-6 md:grid-cols-[1fr_350px] mt-2">
        {/* Left: Recent Rentals Table */}
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl flex flex-col">
          <CardHeader className="px-6 py-5 border-b border-zinc-800/50">
            <CardTitle className="text-base text-white font-medium">Recent Rentals</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Table>
              <TableHeader className="bg-zinc-950/50">
                <TableRow className="border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="text-zinc-500 text-xs font-medium uppercase tracking-wider h-10 px-6">Equipment</TableHead>
                  <TableHead className="text-zinc-500 text-xs font-medium uppercase tracking-wider h-10">Customer</TableHead>
                  <TableHead className="text-right text-zinc-500 text-xs font-medium uppercase tracking-wider h-10 px-6">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <TableCell className="font-medium text-white px-6 py-4">
                      {booking.equipment}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{booking.date}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">{booking.customer}</TableCell>
                    <TableCell className="text-right font-medium text-white px-6">{booking.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right: Alerts */}
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl flex flex-col">
          <CardHeader className="px-6 py-5 border-b border-zinc-800/50">
            <CardTitle className="text-base text-white font-medium">System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <div className="space-y-5">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <div className={`p-1.5 rounded-md ${
                      alert.type === 'warning' ? 'bg-amber-500/10' :
                      alert.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1 my-auto">
                    <p className="text-sm font-medium leading-tight text-white">{alert.message}</p>
                    <p className="text-xs text-zinc-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 shadow-none">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
};
