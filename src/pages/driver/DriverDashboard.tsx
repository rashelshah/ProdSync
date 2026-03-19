import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Navigation, 
  Fuel, 
  MapPin, 
  Clock,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

const DriverDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { trips } = useSelector((state: RootState) => state.transportLogistics);

  const todayTrips = trips.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.startTimestamp).toDateString() === today;
  });

  const totalDistance = trips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);

  const modules = [
    {
      title: 'Trip Logger',
      description: 'Log your trips with GPS tracking',
      icon: Navigation,
      path: '/driver/trips',
      stats: `${todayTrips.length} trips today`,
    },
    {
      title: 'Fuel Entry',
      description: 'Record fuel purchases',
      icon: Fuel,
      path: '/driver/fuel',
      stats: 'Track fuel usage',
    },
    {
      title: 'Geofence',
      description: 'View zone boundaries',
      icon: MapPin,
      path: '/driver/geofence',
      stats: 'Check zones',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 lg:p-6 lg:pt-0 w-full max-w-7xl mx-auto">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Trips Today</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <Clock className="mr-1 h-3 w-3" />
              Active
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{todayTrips.length}</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Trips monitored <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Distance</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <TrendingUp className="mr-1 h-3 w-3" />
              KM
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{totalDistance.toFixed(1)}</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Total distance driven <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Across all logged tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-2 text-white">
        {/* Fill empty visually mimicking the area chart placeholder */}
        <h2 className="text-lg font-semibold mb-4">Transport Tracking</h2>
        <ChartAreaInteractive />
      </div>

      {/* Module Cards */}
      <div className="mt-2">
        <h2 className="text-base font-semibold text-white mb-4">Transport Modules</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.path} to={module.path}>
              <Card className="bg-card border-zinc-800 shadow-none rounded-xl hover:border-zinc-700 hover:bg-card/50 transition-all h-full flex flex-col">
                <CardHeader className="pb-3 flex-1">
                  <div className="p-2 w-10 h-10 flex items-center justify-center bg-card border border-zinc-800 rounded-lg mb-3">
                    <module.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base text-white">{module.title}</CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs font-medium text-zinc-500">{module.stats}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
