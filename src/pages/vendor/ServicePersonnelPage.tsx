import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Plus, Search, Filter, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RootState } from '@/store/store';
import { deletePersonnel, setSearchTerm, setRoleFilter } from '@/store/slices/servicePersonnelSlice';
import { PersonnelCard } from '@/components/service-personnel/PersonnelCard';
import { AddPersonnelForm } from '@/components/service-personnel/AddPersonnelForm';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ServicePersonnelPage: React.FC = () => {
  const dispatch = useDispatch();
  const { personnel, searchTerm, roleFilter } = useSelector((state: RootState) => state.servicePersonnel);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const uniqueRoles = [...new Set(personnel.map(p => p.role))];

  const filteredPersonnel = personnel.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deletePersonnel(deleteId));
      toast({
        title: 'Personnel removed',
        description: 'Service personnel has been removed from your team',
      });
      setDeleteId(null);
    }
  };

  const stats = {
    total: personnel.length,
    available: personnel.filter(p => p.availability === 'available').length,
    booked: personnel.filter(p => p.availability === 'booked').length,
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Service Network</h1>
          <p className="text-zinc-400">Manage and coordinate your verified service personnel.</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-white text-zinc-950 hover:bg-zinc-200">
          <Plus className="mr-2 h-4 w-4" />
          Add Personnel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <Users className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">Total Network</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.available}</p>
              <p className="text-xs text-emerald-500 uppercase tracking-wider font-medium mt-1">Available to Book</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.booked}</p>
              <p className="text-xs text-amber-500 uppercase tracking-wider font-medium mt-1">Currently Deployed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-zinc-800 shadow-none">
        <CardHeader className="border-b border-zinc-800/50 pb-4">
          <CardTitle className="text-lg text-white">Personnel Roster</CardTitle>
          <CardDescription className="text-zinc-400">Search and filter your service team members.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search by name, role, or specialization..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => dispatch(setRoleFilter(value))}>
              <SelectTrigger className="w-full sm:w-56 bg-zinc-950 border-zinc-800 text-white h-11">
                <Filter className="mr-2 h-4 w-4 text-zinc-500" />
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-card border-zinc-800 text-white">
                <SelectItem value="all" className="hover:bg-zinc-800 focus:bg-zinc-800">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role} className="hover:bg-zinc-800 focus:bg-zinc-800">{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredPersonnel.length === 0 ? (
             <div className="text-center py-20 flex flex-col items-center bg-zinc-950/50 border border-zinc-800 border-dashed rounded-xl">
              <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                <Users className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No personnel found</h3>
              <p className="text-zinc-400 mb-6">You haven't added anyone matching this search yet.</p>
              <Button onClick={() => setShowAddDialog(true)} variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
                <Plus className="mr-2 h-4 w-4" /> Add Team Member
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPersonnel.map(person => (
                <PersonnelCard
                  key={person.id}
                  personnel={person}
                  onEdit={(p) => {
                    toast({
                      title: 'Edit functionality',
                      description: 'Edit feature coming soon',
                    });
                  }}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Personnel Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 p-0 !rounded-xl custom-scrollbar gap-0">
          <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">Add New Personnel</DialogTitle>
              <p className="text-sm text-zinc-400 mt-1">Register a new team member and send an app invite.</p>
            </div>
          </div>
          <div className="p-6 px-4 sm:px-6">
            <AddPersonnelForm
              onSuccess={() => setShowAddDialog(false)}
              onCancel={() => setShowAddDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Personnel</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to remove this team member? This action cannot be undone and will revoke their app access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white">
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicePersonnelPage;
