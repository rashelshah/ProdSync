import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Camera, Star, Calendar, TrendingUp, Search, Heart, ShoppingCart, Video, ArrowRight, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store/store';
import canonR5 from '@/assets/canon-eos-r5.jpg';
import sonyA7s3 from '@/assets/sony-a7s3.jpg';
import arriSkypanel from '@/assets/arri-skypanel.jpg';

export const CustomerDashboard: React.FC = () => {
  const { items: favorites } = useSelector((state: RootState) => state.favorites);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { bookings } = useSelector((state: RootState) => state.bookings);

  const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  const featuredEquipment = [
    {
      id: '1',
      name: 'Canon EOS R5',
      category: 'Camera',
      dailyRate: 150,
      rating: 4.9,
      image: canonR5,
      vendor: 'Pro Rental Co.'
    },
    {
      id: '2',
      name: 'Sony FX6 Cinema Camera',
      category: 'Camera',
      dailyRate: 200,
      rating: 4.8,
      image: sonyA7s3,
      vendor: 'Film Studio Gear'
    },
    {
      id: '3',
      name: 'Arri SkyPanel S60-C',
      category: 'Lighting',
      dailyRate: 80,
      rating: 4.9,
      image: arriSkypanel,
      vendor: 'Lighting Masters'
    }
  ];

  const recentBookings = [
    {
      id: 'BKG-001',
      equipment: 'Sony A7S III',
      dates: 'Jan 15-17, 2024',
      status: 'confirmed',
      total: 450
    },
    {
      id: 'BKG-002',
      equipment: 'DJI Ronin 4D',
      dates: 'Jan 10-12, 2024',
      status: 'completed',
      total: 300
    }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header with Search/Action hero */}
      <div className="relative rounded-2xl overflow-hidden bg-card border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2912&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              ProdSync Gear <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">For Your Next Masterpiece</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl">
              Discover, compare, and book professional filmmaking equipment from top-rated vendors in your area.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold h-12 px-8">
                <Link to="/customer/browse">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Catalog
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-zinc-950/50 backdrop-blur-sm border-zinc-700 text-white hover:bg-card h-12 px-8">
                <Link to="/customer/cart">
                  <ShoppingCart className="mr-2 h-5 w-5 text-zinc-400" />
                  Cart ({cartItems.length})
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex shrink-0 w-48 h-48 rounded-full border-8 border-zinc-950/50 relative">
            <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="h-full w-full bg-card rounded-full flex items-center justify-center">
              <Video className="h-16 w-16 text-zinc-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="bg-card border-zinc-800 shadow-none hover:bg-zinc-800/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{activeBookings}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Active Rentals</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none hover:bg-zinc-800/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{favorites.length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Saved Items</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none hover:bg-zinc-800/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <ShoppingCart className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{cartItems.length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">In Cart</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none hover:bg-zinc-800/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <PlayCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{completedBookings}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Featured Equipment (Wider Column) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Top Rated Gear</h2>
              <p className="text-sm text-zinc-400">Fresh additions to the catalog this week</p>
            </div>
            <Button variant="link" asChild className="text-blue-500 hover:text-blue-400 p-0 h-auto">
              <Link to="/customer/browse">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {featuredEquipment.slice(0, 2).map((item) => (
              <Card key={item.id} className="bg-card border-zinc-800 shadow-none overflow-hidden group flex flex-col">
                <div className="relative h-48 sm:h-56 bg-zinc-950 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-zinc-950/80 backdrop-blur-md text-white border-none shrink-0 pointer-events-none">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
                      {item.rating}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <Badge variant="outline" className="bg-zinc-950/50 border-zinc-700/50 backdrop-blur-md text-zinc-300">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-white leading-tight mb-1">{item.name}</h3>
                    <p className="text-sm text-zinc-500">{item.vendor}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xl font-bold text-white">₹{item.dailyRate}</span>
                      <span className="text-xs text-zinc-500 ml-1">/day</span>
                    </div>
                    <Button size="sm" className="bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white rounded-full transition-colors">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Quick list style for extra items */}
          {featuredEquipment.length > 2 && (
            <Card className="bg-card border-zinc-800 shadow-none p-2">
              {featuredEquipment.slice(2).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-lg transition-colors group cursor-pointer">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-950 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate text-sm">{item.name}</h4>
                    <p className="text-xs text-zinc-500">{item.vendor} • {item.category}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="font-semibold text-white text-sm">₹{item.dailyRate}<span className="text-[10px] text-zinc-500 font-normal">/d</span></div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-[10px] text-zinc-400">{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Recent Bookings (Sidebar Pattern) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Rental Activity</h2>
              <p className="text-sm text-zinc-400">Your recent transactions</p>
            </div>
          </div>
          
          <Card className="bg-card border-zinc-800 shadow-none flex flex-col h-[calc(100%-48px)]">
            <CardHeader className="p-5 border-b border-zinc-800/50 pb-4">
              <CardTitle className="text-sm uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                History
                <Button variant="link" asChild className="text-blue-500 hover:text-blue-400 p-0 h-auto font-normal capitalize">
                  <Link to="/customer/bookings">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {recentBookings.length > 0 ? (
                <div className="flex flex-col divide-y divide-zinc-800/50">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-5 hover:bg-zinc-800/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant="outline" 
                          className={`shadow-none border-none px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {booking.status}
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">{booking.id}</span>
                      </div>
                      <h4 className="font-bold text-white text-[15px] mb-1 leading-snug">{booking.equipment}</h4>
                      <p className="text-xs text-zinc-400">{booking.dates}</p>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/80">
                        <span className="text-sm text-zinc-500">Total</span>
                        <span className="font-semibold text-white">₹{booking.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 min-h-[250px]">
                  <Calendar className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm">No recent bookings found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};