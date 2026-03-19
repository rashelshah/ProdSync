import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Star, Heart, Calendar, ShoppingCart, ListFilter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingModal } from '@/components/bookings/BookingModal';
import { VendorRatingBadge } from '@/components/ratings/VendorRatingBadge';
import { Slider } from '@/components/ui/slider';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import canonR5 from '@/assets/canon-eos-r5.jpg';
import sonyA7s3 from '@/assets/sony-a7s3.jpg';
import canon2470 from '@/assets/canon-24-70mm.jpg';
import arriSkypanel from '@/assets/arri-skypanel.jpg';
import rodeVideomic from '@/assets/rode-videomic.jpg';
import djiRonin from '@/assets/dji-ronin-4d.jpg';

export const BrowseEquipment: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: favorites } = useSelector((state: RootState) => state.favorites);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [minRating, setMinRating] = useState([1.0]);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const equipment = [
    {
      id: '1',
      name: 'Canon EOS R5',
      brand: 'Canon',
      category: 'cameras',
      dailyRate: 1500,
      weeklyRate: 9000,
      rating: 4.9,
      reviewCount: 42,
      availability: 'available' as const,
      image: canonR5,
      vendor: 'Pro Rental Co.',
      description: '45MP Full-Frame Mirrorless Camera with 8K Video'
    },
    {
      id: '2',
      name: 'Sony A7S III',
      brand: 'Sony',
      category: 'cameras',
      dailyRate: 1400,
      weeklyRate: 8400,
      rating: 4.8,
      reviewCount: 38,
      availability: 'available' as const,
      image: sonyA7s3,
      vendor: 'Film Studio Gear',
      description: '4K Full-Frame Mirrorless Camera for Video'
    },
    {
      id: '3',
      name: 'Canon 24-70mm f/2.8L',
      brand: 'Canon',
      category: 'lenses',
      dailyRate: 800,
      weeklyRate: 4800,
      rating: 4.9,
      reviewCount: 56,
      availability: 'available' as const,
      image: canon2470,
      vendor: 'Lens Masters',
      description: 'Professional Standard Zoom Lens'
    },
    {
      id: '4',
      name: 'Arri SkyPanel S60-C',
      brand: 'Arri',
      category: 'lighting',
      dailyRate: 1200,
      weeklyRate: 7200,
      rating: 4.9,
      reviewCount: 24,
      availability: 'available' as const,
      image: arriSkypanel,
      vendor: 'Lighting Masters',
      description: 'Full-Color LED Panel with Remote Control'
    },
    {
      id: '5',
      name: 'Rode VideoMic Pro+',
      brand: 'Rode',
      category: 'audio',
      dailyRate: 350,
      weeklyRate: 2100,
      rating: 4.7,
      reviewCount: 31,
      availability: 'rented' as const,
      image: rodeVideomic,
      vendor: 'Sound Solutions',
      description: 'Professional On-Camera Microphone'
    },
    {
      id: '6',
      name: 'DJI Ronin 4D',
      brand: 'DJI',
      category: 'stabilization',
      dailyRate: 2000,
      weeklyRate: 12000,
      rating: 4.8,
      reviewCount: 19,
      availability: 'available' as const,
      image: djiRonin,
      vendor: 'Motion Pictures',
      description: 'Cinema Camera Gimbal System'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cameras', label: 'Cameras' },
    { value: 'lenses', label: 'Lenses' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'audio', label: 'Audio' },
    { value: 'stabilization', label: 'Stabilization' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const filteredEquipment = equipment
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesRating = item.rating >= minRating[0];
      return matchesSearch && matchesCategory && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.dailyRate - b.dailyRate;
        case 'price-high':
          return b.dailyRate - a.dailyRate;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleBookNow = (item: any) => {
    setSelectedEquipment(item);
    setBookingModalOpen(true);
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: `cart-${item.id}`,
      equipmentId: item.id,
      name: item.name,
      brand: item.brand,
      vendor: item.vendor,
      dailyRate: item.dailyRate,
      weeklyRate: item.weeklyRate,
      image: item.image,
      category: item.category,
    }));
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (item: any) => {
    const isFavorite = favorites.some(f => f.equipmentId === item.id);
    dispatch(toggleFavorite({
      equipmentId: item.id,
      name: item.name,
      brand: item.brand,
      vendor: item.vendor,
      category: item.category,
      dailyRate: item.dailyRate,
      weeklyRate: item.weeklyRate,
      rating: item.rating,
      reviewCount: item.reviewCount,
      image: item.image,
      availability: item.availability,
      description: item.description,
    }));
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? `${item.name} has been removed from your favorites.`
        : `${item.name} has been added to your favorites.`,
    });
  };

  const isFavorite = (itemId: string) => favorites.some(f => f.equipmentId === itemId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Equipment Marketplace</h1>
          <p className="text-zinc-400">
            Browse and rent premium filmmaking gear from top vendors.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="bg-card border-zinc-800 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search equipment, brands, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-950 border-zinc-800 text-white h-11"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-44 bg-zinc-950 border-zinc-800 text-white h-11">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-zinc-800 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="hover:bg-zinc-800 focus:bg-zinc-800">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-44 bg-zinc-950 border-zinc-800 text-white h-11">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-zinc-800 text-white">
                    <SelectItem value="name" className="hover:bg-zinc-800 focus:bg-zinc-800">Name A-Z</SelectItem>
                    <SelectItem value="price-low" className="hover:bg-zinc-800 focus:bg-zinc-800">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="hover:bg-zinc-800 focus:bg-zinc-800">Price: High to Low</SelectItem>
                    <SelectItem value="rating" className="hover:bg-zinc-800 focus:bg-zinc-800">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`md:w-auto h-11 ${showFilters ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'}`}
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Advanced Filters Drawer */}
            {showFilters && (
              <div className="pt-4 border-t border-zinc-800 animate-fade-in">
                <div className="space-y-3 max-w-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-300">
                      Minimum Rating
                    </label>
                    <span className="text-sm text-yellow-500 font-medium flex items-center">
                      {minRating[0].toFixed(1)}+ <Star className="ml-1 h-3.5 w-3.5 fill-current" />
                    </span>
                  </div>
                  <Slider
                    value={minRating}
                    onValueChange={setMinRating}
                    min={1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-zinc-400">
          Showing <span className="text-white">{filteredEquipment.length}</span> results
        </p>
      </div>

      {/* Equipment Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="group overflow-hidden bg-card border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-black/50">
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
              <Link to={`/customer/equipment/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </Link>
              <div className="absolute top-0 w-full p-3 flex justify-between items-start pointer-events-none">
                <Badge 
                  className={`pointer-events-auto border-none shadow-sm capitalize ${
                    item.availability === 'available' 
                      ? 'bg-emerald-500/90 text-white hover:bg-emerald-500' 
                      : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {item.availability === 'available' ? 'Available' : 'Rented'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`pointer-events-auto w-8 h-8 rounded-full bg-zinc-950/50 backdrop-blur-md border border-white/10 hover:bg-card ${
                    isFavorite(item.id) ? 'text-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                  onClick={() => handleToggleFavorite(item)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(item.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <Link to={`/customer/equipment/${item.id}`} className="truncate">
                    <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded text-xs shrink-0 border border-zinc-800">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium text-white">{item.rating}</span>
                    <span className="text-zinc-500">({item.reviewCount})</span>
                  </div>
                </div>
                
                <p className="text-xs text-blue-500 font-medium tracking-wide uppercase mb-3">
                  {item.vendor}
                </p>
                
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                  {item.description}
                </p>
              </div>
              
              <div className="mt-auto space-y-4 pt-4 border-t border-zinc-800/50">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white leading-none">₹{item.dailyRate.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 mt-1">per day</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-300 leading-none">₹{item.weeklyRate.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 mt-1">per week</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white shadow-none"
                    disabled={item.availability !== 'available'}
                    onClick={() => handleBookNow(item)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.availability !== 'available'}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="bg-card border-zinc-800 border-dashed">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <Search className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No equipment found</h3>
            <p className="text-zinc-400 max-w-sm">
              We couldn't find any equipment matching your current filters. Try adjusting your search criteria.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setMinRating([1.0]);
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Booking Modal */}
      {selectedEquipment && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedEquipment(null);
          }}
          equipment={selectedEquipment}
        />
      )}
    </div>
  );
};
