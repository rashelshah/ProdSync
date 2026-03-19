import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  addGeofence,
  updateGeofence,
  toggleGeofence,
  calculateDistance,
} from '@/store/slices/transportLogisticsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  MapPin,
  Plus,
  Target,
  Navigation,
  CheckCircle,
  Clock,
  Calendar,
  IndianRupee,
  Map,
  Compass,
  AlertTriangle,
} from 'lucide-react';

export default function GeofencePage() {
  const dispatch = useDispatch();
  const { geofenceConfigs, outstationTriggers, vehicles, currentLocation } = useSelector(
    (state: RootState) => state.transportLogistics
  );
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newGeofence, setNewGeofence] = useState({
    name: '',
    centerLatitude: 19.0760,
    centerLongitude: 72.8777,
    radiusKm: 50,
  });
  
  const handleAddGeofence = () => {
    if (!newGeofence.name) {
      toast.error('Please enter a name');
      return;
    }
    
    dispatch(addGeofence({
      ...newGeofence,
      isActive: true,
    }));
    
    setAddDialogOpen(false);
    setNewGeofence({
      name: '',
      centerLatitude: 19.0760,
      centerLongitude: 72.8777,
      radiusKm: 50,
    });
    toast.success('Geofence added');
  };
  
  const handleToggle = (id: string) => {
    dispatch(toggleGeofence(id));
  };
  
  const getCurrentLocationStatus = (geofence: typeof geofenceConfigs[0]) => {
    if (!currentLocation) return null;
    
    const distance = calculateDistance(
      geofence.centerLatitude,
      geofence.centerLongitude,
      currentLocation.latitude,
      currentLocation.longitude
    );
    
    return {
      distance: distance.toFixed(1),
      isOutside: distance > geofence.radiusKm,
    };
  };
  
  // Group triggers by date
  const triggersByDate = outstationTriggers.reduce((acc, trigger) => {
    const date = new Date(trigger.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trigger);
    return acc;
  }, {} as Record<string, typeof outstationTriggers>);

  const activeGeofencesCount = geofenceConfigs.filter(g => g.isActive).length;
  
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Geofence & Outstation</h1>
          <p className="text-zinc-400">Manage virtual boundaries and automated outstation allowance triggers.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Geofence Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Geofence Zone</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Define a center coordinate and radius for outstation detection.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2.5">
                <Label className="text-zinc-300">Zone Name</Label>
                <Input
                  placeholder="e.g., Mumbai City Limits"
                  className="bg-card border-zinc-800 text-white"
                  value={newGeofence.name}
                  onChange={(e) => setNewGeofence({ ...newGeofence, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label className="text-zinc-300">Latitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    className="bg-background border-border text-foreground font-mono"
                    value={newGeofence.centerLatitude}
                    onChange={(e) => setNewGeofence({ ...newGeofence, centerLatitude: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-muted-foreground">Longitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    className="bg-background border-border text-foreground font-mono"
                    value={newGeofence.centerLongitude}
                    onChange={(e) => setNewGeofence({ ...newGeofence, centerLongitude: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-zinc-300">Radius (km)</Label>
                <Input
                  type="number"
                  className="bg-card border-zinc-800 text-white"
                  value={newGeofence.radiusKm}
                  onChange={(e) => setNewGeofence({ ...newGeofence, radiusKm: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={handleAddGeofence}>Add Geofence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Current Location */}
      {currentLocation && (
        <Card className="bg-blue-500/5 border-blue-500/20 shadow-none">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center relative">
              <Navigation className="w-5 h-5 text-blue-500" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-zinc-950 animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">System Current Location (Simulated)</p>
              <p className="text-xs text-blue-400 font-mono mt-0.5">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{geofenceConfigs.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Zones</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500 mb-1">
              {activeGeofencesCount}
            </div>
            <div className="text-xs text-emerald-500/80 uppercase tracking-wider font-medium">Active Zones</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500 mb-1">{outstationTriggers.length}</div>
            <div className="text-xs text-orange-500/80 uppercase tracking-wider font-medium">Outstation Triggers</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {Object.keys(triggersByDate).length}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Trigger Days</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Geofence Zones */}
        <Card className="bg-card border-border shadow-none flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-muted-foreground" />
              Configured Zones
            </CardTitle>
            <CardDescription className="text-muted-foreground">Active zones trigger outstation allowance when boundaries are crossed.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            {geofenceConfigs.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center bg-background/50 rounded-xl border border-border border-dashed">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                  <Map className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-white mb-1">No geofence zones</p>
                <p className="text-sm text-zinc-400 max-w-[250px]">Create a zone to start monitoring vehicle boundaries.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {geofenceConfigs.map(geofence => {
                  const locationStatus = getCurrentLocationStatus(geofence);
                  return (
                    <div
                      key={geofence.id}
                      className={`p-5 border rounded-xl bg-background transition-colors ${geofence.isActive ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-border'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${geofence.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white tracking-tight">{geofence.name}</h4>
                            <p className="text-sm text-zinc-400 mt-1">
                              Radius: <span className="text-zinc-300 font-medium">{geofence.radiusKm} km</span>
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={geofence.isActive}
                          onCheckedChange={() => handleToggle(geofence.id)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div className="p-2.5 bg-muted/30 rounded-lg border border-border/50">
                          <span className="text-muted-foreground uppercase tracking-wider block mb-1">Center</span>
                          <span className="font-mono text-foreground">
                            {geofence.centerLatitude.toFixed(4)}, {geofence.centerLongitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="p-2.5 bg-muted/30 rounded-lg border border-border/50">
                          <span className="text-muted-foreground uppercase tracking-wider block mb-1">Boundary</span>
                          <span className="font-medium text-foreground">{geofence.radiusKm} km from center</span>
                        </div>
                      </div>
                      
                      {locationStatus && geofence.isActive && (
                        <div className={`mt-2 p-2.5 rounded-lg text-xs font-medium flex items-center border ${
                          locationStatus.isOutside 
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          <Compass className="w-4 h-4 mr-2 shrink-0" />
                          {locationStatus.isOutside 
                            ? `Outside zone (${locationStatus.distance} km from center)`
                            : `Inside zone (${locationStatus.distance} km from center)`
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Outstation Triggers */}
        <Card className="bg-card border-border shadow-none flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-muted-foreground" />
              Allowance Triggers
            </CardTitle>
            <CardDescription className="text-muted-foreground">Automatic records when vehicles cross boundaries.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            {outstationTriggers.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center bg-background/50 rounded-xl border border-border border-dashed">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                  <Navigation className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-1">No triggers recorded</p>
                <p className="text-sm text-muted-foreground max-w-[250px]">Triggers are created when active trips cross boundaries.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(triggersByDate).reverse().map(([date, triggers]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-800 border-none font-medium">{date}</Badge>
                      <div className="h-px bg-zinc-800 flex-1"></div>
                      <span className="text-zinc-500 text-xs uppercase tracking-wider">
                        {triggers.length} trigger{triggers.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {triggers.map(trigger => {
                        const vehicle = vehicles.find(v => v.id === trigger.vehicleId);
                        return (
                          <div
                            key={trigger.id}
                            className="p-4 bg-background border border-border hover:border-zinc-700 transition-colors rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-none hover:bg-orange-500/10 uppercase tracking-wider text-[10px]">
                                  Outstation
                                </Badge>
                                <span className="font-semibold text-white">{vehicle?.name || 'Unknown Vehicle'}</span>
                              </div>
                              {trigger.syncedToServer ? (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Synced</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Pending</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Dist: <span className="text-foreground">{trigger.distanceFromCenterKm.toFixed(1)} km</span></span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-foreground">{new Date(trigger.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
