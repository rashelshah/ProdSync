import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateEquipment, Equipment } from '@/store/slices/inventorySlice';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Upload, X, Save, Package, Tag, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const equipmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  brand: z.string().min(1, 'Brand is required').max(50, 'Brand must be less than 50 characters'),
  model: z.string().min(1, 'Model is required').max(50, 'Model must be less than 50 characters'),
  category: z.enum(['cameras', 'lenses', 'lighting', 'audio', 'stabilization', 'accessories']),
  subcategory: z.string().min(1, 'Subcategory is required').max(50, 'Subcategory must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  dailyRate: z.coerce.number().min(1, 'Daily rate must be at least ₹1').max(100000, 'Daily rate must be less than ₹100000'),
  weeklyRate: z.coerce.number().min(1, 'Weekly rate must be at least ₹1').max(500000, 'Weekly rate must be less than ₹500000'),
  condition: z.enum(['excellent', 'good', 'fair']),
  availability: z.enum(['available', 'rented', 'maintenance']),
  yearPurchased: z.string().regex(/^\d{4}$/, 'Year must be a valid 4-digit year'),
  serialNumber: z.string().min(1, 'Serial number is required').max(50, 'Serial number must be less than 50 characters'),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

export const EditFilmGearPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  const storeEquipment = useSelector((state: RootState) => 
    state.inventory.equipment.find(e => e.id === id)
  );

  useEffect(() => {
    // In a real app we'd fetch or wait until ready. 
    // Due to mock, we might fallback if not in store, 
    // but the store initialization usually has it if seeded.
    if (storeEquipment) {
      setEquipment(storeEquipment);
      setImageFiles(storeEquipment.images || []);
    }
  }, [id, storeEquipment, navigate]);

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: '',
      brand: '',
      model: '',
      category: 'cameras',
      subcategory: '',
      description: '',
      dailyRate: 0,
      weeklyRate: 0,
      condition: 'excellent',
      availability: 'available',
      yearPurchased: new Date().getFullYear().toString(),
      serialNumber: '',
    },
  });

  useEffect(() => {
    if (equipment) {
      form.reset({
        name: equipment.name,
        brand: equipment.brand,
        model: equipment.model,
        category: equipment.category,
        subcategory: equipment.subcategory,
        description: equipment.description,
        dailyRate: equipment.dailyRate,
        weeklyRate: equipment.weeklyRate,
        condition: equipment.condition,
        availability: equipment.availability,
        yearPurchased: equipment.yearPurchased,
        serialNumber: equipment.serialNumber,
      });
    }
  }, [equipment, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageFiles((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EquipmentFormData) => {
    if (!equipment) return;

    const updatedEquipment: Equipment = {
      ...equipment,
      name: data.name,
      brand: data.brand,
      model: data.model,
      category: data.category,
      subcategory: data.subcategory,
      description: data.description,
      dailyRate: data.dailyRate,
      weeklyRate: data.weeklyRate,
      availability: data.availability,
      images: imageFiles,
      condition: data.condition,
      yearPurchased: data.yearPurchased,
      serialNumber: data.serialNumber,
    };

    dispatch(updateEquipment(updatedEquipment));
    toast.success('Equipment updated successfully!');
    navigate('/inventory');
  };

  if (!equipment) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500 animate-pulse">Loading equipment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/inventory')} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Edit Equipment</h1>
          <p className="text-zinc-400 text-sm">Update details for {equipment.name}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Basic Details */}
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="flex items-center text-lg text-white">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-zinc-300">Equipment Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Canon EOS R5" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-zinc-800 text-white">
                        <SelectItem value="cameras" className="hover:bg-zinc-800 focus:bg-zinc-800">Cameras</SelectItem>
                        <SelectItem value="lenses" className="hover:bg-zinc-800 focus:bg-zinc-800">Lenses</SelectItem>
                        <SelectItem value="lighting" className="hover:bg-zinc-800 focus:bg-zinc-800">Lighting</SelectItem>
                        <SelectItem value="audio" className="hover:bg-zinc-800 focus:bg-zinc-800">Audio</SelectItem>
                        <SelectItem value="stabilization" className="hover:bg-zinc-800 focus:bg-zinc-800">Stabilization</SelectItem>
                        <SelectItem value="accessories" className="hover:bg-zinc-800 focus:bg-zinc-800">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Subcategory *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mirrorless Camera" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Brand *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Canon" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Model *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EOS R5" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-zinc-300">Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the equipment, its features, and any included accessories..."
                        className="min-h-[120px] bg-zinc-950 border-zinc-800 text-white resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section 2: Pricing, Condition & Availability */}
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="flex items-center text-lg text-white">
                <Tag className="w-5 h-5 mr-2 text-emerald-500" />
                Pricing & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Daily Rate (₹) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2500" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weeklyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Weekly Rate (₹) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Condition *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-zinc-800 text-white">
                        <SelectItem value="excellent" className="hover:bg-zinc-800 focus:bg-zinc-800">Excellent</SelectItem>
                        <SelectItem value="good" className="hover:bg-zinc-800 focus:bg-zinc-800">Good</SelectItem>
                        <SelectItem value="fair" className="hover:bg-zinc-800 focus:bg-zinc-800">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Availability *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-zinc-800 text-white">
                        <SelectItem value="available" className="hover:bg-zinc-800 focus:bg-zinc-800 text-emerald-500">Available</SelectItem>
                        <SelectItem value="rented" className="hover:bg-zinc-800 focus:bg-zinc-800 text-blue-500">On Rental</SelectItem>
                        <SelectItem value="maintenance" className="hover:bg-zinc-800 focus:bg-zinc-800 text-amber-500">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearPurchased"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Year Purchased *</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel className="text-zinc-300">Serial Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="SN123456789" className="bg-zinc-950 border-zinc-800 text-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section 3: Images */}
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="flex items-center text-lg text-white">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-500" />
                Equipment Images
              </CardTitle>
              <CardDescription className="text-zinc-400">Upload high-quality images of the equipment.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-300 mb-1">Click to upload images</p>
                    <p className="text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>

                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {imageFiles.map((image, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-zinc-800"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 pb-8">
            <Button type="button" variant="outline" onClick={() => navigate('/inventory')} className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8">
              Cancel
            </Button>
            <Button type="submit" className="bg-white text-zinc-950 hover:bg-zinc-200 px-8 font-semibold">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
