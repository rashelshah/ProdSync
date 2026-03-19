import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { BookingModal } from '@/components/bookings/BookingModal';
import { useToast } from '@/hooks/use-toast';

export const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items } = useSelector((state: RootState) => state.cart);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.dailyRate * item.quantity), 0);
  };

  const handleRemoveItem = (equipmentId: string) => {
    dispatch(removeFromCart(equipmentId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleUpdateQuantity = (equipmentId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ equipmentId, quantity: newQuantity }));
  };

  const handleBookItem = (item: any) => {
    setSelectedEquipment({
      id: item.equipmentId,
      name: item.name,
      vendor: item.vendor,
      dailyRate: item.dailyRate,
      weeklyRate: item.weeklyRate,
      image: item.image,
    });
    setBookingModalOpen(true);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Shopping Cart</h1>
          <p className="text-zinc-400">Review your selected equipment before booking.</p>
        </div>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 bg-zinc-950 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
              <ShoppingCart className="h-10 w-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
            <p className="text-zinc-400 max-w-sm mb-8">
              Looks like you haven't added any gear yet. Discover top-tier equipment for your next shoot.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-8" asChild>
              <Link to="/customer/browse">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Equipment
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Shopping Cart</h1>
          <p className="text-zinc-400">
            You have <span className="font-medium text-white">{items.length} item{items.length !== 1 && 's'}</span> ready to book
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearCart} className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.equipmentId} className="bg-card border-zinc-800 shadow-none overflow-hidden group">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto bg-zinc-950 shrink-0 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-zinc-950/80 backdrop-blur-md border-zinc-700 text-zinc-300 shadow-none">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-white leading-tight">{item.name}</h3>
                        <p className="text-sm text-blue-500 font-medium mt-1">{item.vendor}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.equipmentId)}
                        className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 shrink-0 h-8 w-8 -mr-2 -mt-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mt-6">
                    <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white rounded-md"
                        onClick={() => handleUpdateQuantity(item.equipmentId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white rounded-md"
                        onClick={() => handleUpdateQuantity(item.equipmentId, item.quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-lg text-white">
                          ₹{(item.dailyRate * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-zinc-500">
                          ₹{item.dailyRate.toLocaleString()} /day each
                        </p>
                      </div>
                      <Button
                        className="bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white transition-colors"
                        onClick={() => handleBookItem(item)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 bg-card border-zinc-800 shadow-none">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="text-lg text-white">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.equipmentId} className="flex justify-between text-sm">
                    <span className="text-zinc-400 truncate pr-4">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="text-white font-medium whitespace-nowrap">
                      ₹{(item.dailyRate * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-6">
                <Separator className="bg-zinc-800" />
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="text-zinc-300 font-medium">Daily Rental Subtotal</span>
                <span className="text-xl font-bold text-white">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <p className="text-xs text-zinc-500 flex items-center mb-6">
                <Calendar className="w-3 h-3 mr-1" />
                Final price calculated based on rental dates
              </p>

              <div className="pt-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12" asChild>
                  <Link to="/customer/browse">
                    <Plus className="mr-2 h-4 w-4" />
                    Add More Gear
                  </Link>
                </Button>
              </div>
            </CardContent>
            
            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 rounded-b-xl">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="text-zinc-300 font-medium block mb-0.5">Note:</span>
                  To finalize, click "Book Now" on individual items above to select dates and location.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
