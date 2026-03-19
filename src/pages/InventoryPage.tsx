import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Camera,
  X,
  LayoutGrid,
  List,
  MoreVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { RootState } from '@/store/store';
import { setSearchTerm, setCategoryFilter, deleteEquipment, Equipment } from '@/store/slices/inventorySlice';
import { toast } from 'sonner';

// Mock data omitted for brevity if too long, but I need to include it so the page works standalone.
const mockEquipment = [
  {
    id: '1',
    name: 'Canon EOS R5',
    brand: 'Canon',
    model: 'EOS R5',
    category: 'cameras' as const,
    subcategory: 'Mirrorless Camera',
    description: 'Professional full-frame mirrorless camera with 8K video recording',
    dailyRate: 1200,
    weeklyRate: 7000,
    availability: 'available' as const,
    images: [],
    specifications: { sensor: '45MP Full Frame', video: '8K RAW, 4K 120p', iso: '100-51200', mount: 'RF Mount' },
    condition: 'excellent' as const,
    yearPurchased: '2023',
    serialNumber: 'CR5001234',
    accessories: ['Battery Grip', 'CFexpress Card', 'Battery x2'],
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Sony FX30',
    brand: 'Sony',
    model: 'FX30',
    category: 'cameras' as const,
    subcategory: 'Cinema Camera',
    description: 'Compact cinema camera with APS-C sensor',
    dailyRate: 800,
    weeklyRate: 4500,
    availability: 'rented' as const,
    images: [],
    specifications: { sensor: 'APS-C CMOS', video: '4K 120p', iso: '100-32000', mount: 'E Mount' },
    condition: 'excellent' as const,
    yearPurchased: '2023',
    serialNumber: 'FX3001234',
    accessories: ['Top Handle', 'V-Mount Battery', 'Monitor'],
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Canon RF 24-70mm f/2.8L',
    brand: 'Canon',
    model: 'RF 24-70mm f/2.8L IS USM',
    category: 'lenses' as const,
    subcategory: 'Zoom Lens',
    description: 'Professional standard zoom lens with image stabilization',
    dailyRate: 300,
    weeklyRate: 1800,
    availability: 'available' as const,
    images: [],
    specifications: { mount: 'Canon RF', aperture: 'f/2.8', stabilization: '5-stop IS', weight: '900g' },
    condition: 'excellent' as const,
    yearPurchased: '2023',
    serialNumber: 'RF2470001',
    accessories: ['Lens Hood', 'UV Filter', 'Lens Case'],
    createdAt: '2024-01-03',
  },
  {
    id: '4',
    name: 'ARRI SkyPanel S60-C',
    brand: 'ARRI',
    model: 'A-SkyPanel S60',
    category: 'lighting' as const,
    subcategory: 'LED Panel',
    description: 'Color-tunable LED softlight with full spectrum control',
    dailyRate: 450,
    weeklyRate: 2500,
    availability: 'maintenance' as const,
    images: [],
    specifications: { power: '400W', color: 'Full RGB+W', beam: '115°', control: 'DMX' },
    condition: 'fair' as const,
    yearPurchased: '2021',
    serialNumber: 'AS60X12',
    accessories: ['Softbox', 'Cable'],
    createdAt: '2024-01-04',
  }
];

const videoCategories = [
  'All Categories', 
  'Cameras', 
  'Lenses', 
  'Lighting', 
  'Audio', 
  'Stabilization', 
  'Accessories'
];

export const InventoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTerm, categoryFilter } = useSelector((state: RootState) => state.inventory);
  
  const [viewMode, setViewMode] = useState<'table'|'grid'>('table');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [conditionFilters, setConditionFilters] = useState<string[]>([]);
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Available</Badge>;
      case 'rented':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Rented</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Maintenance</Badge>;
      default:
        return <Badge variant="outline" className="text-zinc-400 border-zinc-700 capitalize">{availability}</Badge>;
    }
  };

  const handleView = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setViewDialogOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    navigate(`/inventory/edit/${equipment.id}`);
  };

  const handleDeleteClick = (equipmentId: string) => {
    setEquipmentToDelete(equipmentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (equipmentToDelete) {
      dispatch(deleteEquipment(equipmentToDelete));
      toast.success('Equipment removed from inventory');
      setEquipmentToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const clearAllFilters = () => {
    setConditionFilters([]);
    setAvailabilityFilters([]);
    setPriceRange([0, 5000]);
    dispatch(setCategoryFilter('all'));
    dispatch(setSearchTerm(''));
  };

  const activeFilterCount = conditionFilters.length + availabilityFilters.length + 
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0) + (categoryFilter !== 'all' && categoryFilter !== 'All Categories' ? 1 : 0);

  const filteredEquipment = mockEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || categoryFilter === 'All Categories' || 
                           item.category === categoryFilter.toLowerCase();
    const matchesCondition = conditionFilters.length === 0 || conditionFilters.includes(item.condition);
    const matchesAvailability = availabilityFilters.length === 0 || availabilityFilters.includes(item.availability);
    const matchesPrice = item.dailyRate >= priceRange[0] && item.dailyRate <= priceRange[1];
    return matchesSearch && matchesCategory && matchesCondition && matchesAvailability && matchesPrice;
  });

  return (
    <div className="flex flex-col gap-6 pb-8 h-full">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Film Equipment</h1>
          <p className="text-zinc-400 text-sm">Manage your gear catalog and availability.</p>
        </div>
        <Link to="/inventory/add">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </Link>
      </div>

      {/* 2. FILTERS BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-zinc-800 p-2 rounded-xl shadow-sm">
        <div className="flex w-full sm:w-auto flex-1 gap-2 items-center px-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => dispatch(setCategoryFilter(v))}>
            <SelectTrigger className="w-[160px] bg-zinc-950 border-zinc-800 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-zinc-800 text-white">
              {videoCategories.map((c) => (
                <SelectItem key={c} value={c.toLowerCase()} className="hover:bg-zinc-800 focus:bg-zinc-800">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-800 hover:text-white">
                <Filter className="w-4 h-4 mr-2 text-zinc-400" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white h-5 px-1.5">{activeFilterCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card border-zinc-800" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="font-semibold text-white">Advanced Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-8">
                    Clear All
                  </Button>
                </div>
                {/* Advanced filters content */}
                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">Condition</Label>
                    <div className="flex flex-wrap gap-2">
                      {['excellent', 'good', 'fair'].map(c => (
                        <Badge 
                          key={c}
                          variant="outline" 
                          className={`cursor-pointer capitalize px-3 py-1 ${conditionFilters.includes(c) ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                          onClick={() => setConditionFilters(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">Availability</Label>
                    <div className="flex flex-wrap gap-2">
                      {['available', 'rented', 'maintenance'].map(a => (
                        <Badge 
                          key={a}
                          variant="outline" 
                          className={`cursor-pointer capitalize px-3 py-1 ${availabilityFilters.includes(a) ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                          onClick={() => setAvailabilityFilters(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])}
                        >
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent border-zinc-800 text-white hover:bg-zinc-800" onClick={() => setFiltersOpen(false)}>
                    View {filteredEquipment.length} Results
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-md ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      {viewMode === 'table' ? (
        <Card className="bg-card border border-zinc-800 shadow-none overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium py-4">Equipment Details</TableHead>
                <TableHead className="text-zinc-400 font-medium">Category</TableHead>
                <TableHead className="text-zinc-400 font-medium">Pricing / Day</TableHead>
                <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-zinc-500">No equipment found.</TableCell>
                </TableRow>
              ) : filteredEquipment.map((equipment, i) => (
                <TableRow key={equipment.id} className={`border-zinc-800 transition-colors ${i % 2 === 0 ? 'bg-card/40' : 'bg-card'} hover:bg-zinc-800/80`}>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                        <Camera className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white line-clamp-1">{equipment.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{equipment.brand} • {equipment.model}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize bg-zinc-950 text-zinc-300 border-zinc-700">
                      {equipment.subcategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-white">₹{equipment.dailyRate.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {getAvailabilityBadge(equipment.availability)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-card border-zinc-800 text-zinc-300">
                        <DropdownMenuItem onClick={() => handleView(equipment)} className="hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white">
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(equipment)} className="hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(equipment.id)} className="text-red-400 hover:bg-red-400/10 cursor-pointer focus:bg-red-400/10 focus:text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEquipment.length === 0 ? (
            <div className="col-span-full h-32 flex items-center justify-center text-zinc-500 bg-card rounded-xl border border-zinc-800">
              No equipment found.
            </div>
          ) : filteredEquipment.map((equipment) => (
            <Card key={equipment.id} className="bg-card border-zinc-800 shadow-none overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col">
              <div className="aspect-video bg-zinc-950 flex items-center justify-center border-b border-zinc-800 relative">
                <Camera className="w-10 h-10 text-zinc-700" />
                <div className="absolute top-3 right-3">
                  {getAvailabilityBadge(equipment.availability)}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <Badge variant="outline" className="w-max mb-2 uppercase text-[10px] tracking-wider bg-zinc-950 text-zinc-400 border-zinc-800">
                  {equipment.category}
                </Badge>
                <h3 className="font-semibold text-white line-clamp-1 mb-1">{equipment.name}</h3>
                <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{equipment.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">₹{equipment.dailyRate.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 ml-1">/ day</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card border-zinc-800 text-zinc-300">
                      <DropdownMenuItem onClick={() => handleView(equipment)} className="hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white">
                        <Eye className="w-4 h-4 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(equipment)} className="hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(equipment.id)} className="text-red-400 hover:bg-red-400/10 cursor-pointer focus:bg-red-400/10 focus:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog and Delete Dialogs remain technically the same but with dark theme classes */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-zinc-800 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedEquipment?.name}</DialogTitle>
            <DialogDescription className="text-zinc-400">{selectedEquipment?.description}</DialogDescription>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-medium text-zinc-300 text-sm uppercase tracking-wider">Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <dt className="text-zinc-500">Brand</dt>
                      <dd className="font-medium text-zinc-200">{selectedEquipment.brand}</dd>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <dt className="text-zinc-500">Model</dt>
                      <dd className="font-medium text-zinc-200">{selectedEquipment.model}</dd>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <dt className="text-zinc-500">Condition</dt>
                      <dd className="font-medium text-zinc-200 capitalize">{selectedEquipment.condition}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">S/N</dt>
                      <dd className="font-medium text-zinc-200">{selectedEquipment.serialNumber}</dd>
                    </div>
                  </dl>
                </div>
                <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-medium text-zinc-300 text-sm uppercase tracking-wider">Pricing</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <dt className="text-zinc-500">Daily Rate</dt>
                      <dd className="font-medium text-zinc-200">₹{selectedEquipment.dailyRate.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Weekly Rate</dt>
                      <dd className="font-medium text-zinc-200">₹{selectedEquipment.weeklyRate.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this equipment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800" onClick={() => setEquipmentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-0"
            >
              Delete Equipment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};