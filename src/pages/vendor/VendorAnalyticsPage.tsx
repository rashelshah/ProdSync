import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TrendingUp, Package, Users, IndianRupee, Calendar, Download, FileText, FileSpreadsheet, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const revenueData = [
  { month: 'Jan', revenue: 45000, bookings: 12 },
  { month: 'Feb', revenue: 52000, bookings: 15 },
  { month: 'Mar', revenue: 48000, bookings: 13 },
  { month: 'Apr', revenue: 61000, bookings: 18 },
  { month: 'May', revenue: 55000, bookings: 16 },
  { month: 'Jun', revenue: 67000, bookings: 20 },
];

const topEquipment = [
  { name: 'Canon EOS R5', rentals: 24, revenue: 96000 },
  { name: 'Sony A7S III', rentals: 19, revenue: 76000 },
  { name: 'DJI Ronin 4D', rentals: 15, revenue: 120000 },
  { name: 'ARRI SkyPanel', rentals: 12, revenue: 48000 },
];

const topCustomers = [
  { name: 'Rajesh Kumar', bookings: 8, spent: 45000 },
  { name: 'Priya Sharma', bookings: 6, spent: 38000 },
  { name: 'Amit Patel', bookings: 5, spent: 32000 },
  { name: 'Sneha Reddy', bookings: 4, spent: 28000 },
];

export const VendorAnalyticsPage: React.FC = () => {
  const handleExport = (format: string) => {
    toast.success(`Generating ${format.toUpperCase()} report...`);
    setTimeout(() => toast.success(`${format.toUpperCase()} report downloaded`), 1500);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-zinc-800 p-3 rounded-lg shadow-xl outline-none">
          <p className="text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wider">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-white font-medium">
                {entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}
                <span className="text-zinc-500 ml-1 font-normal capitalize">{entry.name}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics & Reports</h1>
          <p className="text-zinc-400 text-sm">Track your business performance and generate detailed reports.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-zinc-800 text-white w-48">
            <DropdownMenuItem onClick={() => handleExport('pdf')} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
              <FileText className="w-4 h-4 mr-2 text-zinc-400" /> PDF Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 mr-2 text-zinc-400" /> CSV Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 mr-2 text-zinc-400" /> Excel Spreadsheet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* KEY METRICS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">₹3,28,000</div>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5%</span> <span className="text-zinc-500 ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Bookings</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">94</div>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span> <span className="text-zinc-500 ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Rentals</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <p className="text-xs text-zinc-500">Equipment currently out</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">47</div>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+5</span> <span className="text-zinc-500 ml-1">new this month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <Tabs defaultValue="revenue" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
          <TabsList className="bg-card/50 border border-zinc-800 p-1">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 rounded-md px-3 py-1.5 text-xs font-medium flex items-center">
              <LineChartIcon className="w-3.5 h-3.5 mr-1.5" /> Revenue
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 rounded-md px-3 py-1.5 text-xs font-medium flex items-center">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Bookings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="revenue" className="mt-0 outline-none">
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="pb-8">
              <CardTitle className="text-base text-white">Monthly Revenue</CardTitle>
              <CardDescription className="text-zinc-400">Revenue generated over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="mt-0 outline-none">
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="pb-8">
              <CardTitle className="text-base text-white">Booking Trends</CardTitle>
              <CardDescription className="text-zinc-400">Total number of successful bookings per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
                    <Bar 
                      dataKey="bookings" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* TOP PERFORMERS */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <CardTitle className="text-base text-white">Top Performing Equipment</CardTitle>
            <CardDescription className="text-zinc-400">Most rented items generating highest revenue</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {topEquipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center text-zinc-500 font-bold group-hover:border-zinc-600 transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.rentals} rentals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
              View Complete Inventory Stats
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <CardTitle className="text-base text-white">Top Customers</CardTitle>
            <CardDescription className="text-zinc-400">Your most frequent and valuable clients</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-300 font-semibold group-hover:border-blue-500/50 transition-colors">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{customer.name}</p>
                      <p className="text-xs text-zinc-500">{customer.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹{customer.spent.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
              View Directory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
