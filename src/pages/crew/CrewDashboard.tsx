import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  FileText, 
  Clapperboard, 
  Box,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

const CrewDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { handovers, cameraReports } = useSelector((state: RootState) => state.cameraDepartment);

  const pendingHandovers = handovers.filter(h => !h.confirmedAt).length;
  const completedReports = cameraReports.filter(r => r.syncedToServer).length;

  const modules = [
    {
      title: 'Asset Handover',
      description: 'Verify and receive equipment',
      icon: Package,
      path: '/crew/handover',
      stats: `${pendingHandovers} pending`,
    },
    {
      title: 'RFQ Management',
      description: 'Request quotes for equipment',
      icon: FileText,
      path: '/crew/rfq',
      stats: 'Submit requests',
    },
    {
      title: 'Camera Reports',
      description: 'Log scene/shot metadata',
      icon: Clapperboard,
      path: '/crew/reports',
      stats: `${completedReports} synced`,
    },
    {
      title: 'Expendables',
      description: 'Track consumable inventory',
      icon: Box,
      path: '/crew/expendables',
      stats: 'Check stock',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 lg:p-6 lg:pt-0 w-full max-w-7xl mx-auto">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending Assets</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <AlertCircle className="mr-1 h-3 w-3 text-amber-500" />
              Attention
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{pendingHandovers}</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Requires verification <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Handovers awaiting signature
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Synced Reports</CardTitle>
            <div className="flex items-center text-[10px] font-medium text-white bg-zinc-800/80 px-2.5 py-1 rounded-md">
              <CheckCircle className="mr-1 h-3 w-3 text-emerald-500" />
              Secured
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{completedReports}</div>
            <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center">
              Safely synced to server <ArrowUpRight className="ml-1 h-3 w-3" />
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              DIT logs backed up
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-2 text-white">
        <h2 className="text-lg font-semibold mb-4">Operations Overview</h2>
        <ChartAreaInteractive />
      </div>

      {/* Module Cards */}
      <div className="mt-2">
        <h2 className="text-base font-semibold text-white mb-4">Camera Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

export default CrewDashboard;
