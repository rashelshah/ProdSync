import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateBookingStatus } from '@/store/slices/bookingsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
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
import { toast } from 'sonner';
import { PaymentTracker } from '@/components/bookings/PaymentTracker';

export const ActiveRentalsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const activeRentals = bookings.filter(b => b.status === 'confirmed');

  const handleCompleteRental = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setShowCompleteDialog(true);
  };

  const confirmComplete = () => {
    if (selectedBooking) {
      dispatch(updateBookingStatus({ 
        id: selectedBooking, 
        status: 'completed',
        paymentStatus: 'released'
      }));
      toast.success('Rental marked as completed', {
        description: 'Payment has been released to your account'
      });
      setShowCompleteDialog(false);
      setSelectedBooking(null);
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, variant: 'destructive', colorClass: 'bg-red-500/10 text-red-500 border-red-500/20' };
    if (days === 0) return { text: 'Due today', variant: 'warning', colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (days <= 2) return { text: `${days} days left`, variant: 'warning', colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { text: `${days} days left`, variant: 'default', colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Active Rentals</h1>
        <p className="text-zinc-400 text-sm">
          Track and manage equipment currently out on rent.
        </p>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Active</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{activeRentals.length}</div>
            <p className="text-xs text-zinc-500">Equipment currently out</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Due Soon (2 Days)</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {activeRentals.filter(b => {
                const days = differenceInDays(new Date(b.endDate), new Date());
                return days >= 0 && days <= 2;
              }).length}
            </div>
            <p className="text-xs text-zinc-500">Returns incoming soon</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-zinc-800 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Overdue Returns</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {activeRentals.filter(b => differenceInDays(new Date(b.endDate), new Date()) < 0).length}
            </div>
            <p className="text-xs text-zinc-500">Immediate action required</p>
          </CardContent>
        </Card>
      </div>

      {/* ACTIVE RENTALS LIST */}
      {activeRentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-zinc-800 rounded-xl mt-4">
          <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700">
            <Package className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Active Rentals</h3>
          <p className="text-zinc-400 text-sm text-center max-w-sm">
            All your equipment is currently safely stored in your inventory.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-4">
          {activeRentals.map((booking) => {
            const daysInfo = getDaysRemaining(booking.endDate);
            const rentalDuration = Math.max(1, differenceInDays(new Date(booking.endDate), new Date(booking.startDate)));
            
            return (
              <Card key={booking.id} className="bg-card border-zinc-800 shadow-none overflow-hidden hover:border-zinc-700 transition-colors flex flex-col">
                <div className="p-5 border-b border-zinc-800/50 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-lg text-white leading-tight">{booking.equipmentName}</h3>
                    <Badge variant="outline" className={`shrink-0 ${daysInfo.colorClass}`}>
                      {daysInfo.text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <span>{rentalDuration} Day Rental</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-emerald-500">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col gap-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      <User className="h-3.5 w-3.5" /> Customer Profile
                    </h4>
                    <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
                      <p className="text-sm font-medium text-zinc-200">{booking.customerName}</p>
                      <p className="text-xs text-zinc-400 truncate">{booking.customerEmail}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5" /> Timeline
                    </h4>
                    <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">Out</p>
                        <p className="text-sm text-zinc-300">{format(new Date(booking.startDate), 'MMM dd')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">Return By</p>
                        <p className="text-sm text-zinc-300">{format(new Date(booking.endDate), 'MMM dd')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button 
                    className="w-full mt-auto bg-white text-zinc-950 hover:bg-zinc-200 font-semibold"
                    onClick={() => handleCompleteRental(booking.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Returned
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* COMPLETE RENTAL DIALOG */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent className="bg-card border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Equipment Returned?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Confirm that the equipment has been returned in good condition. This will complete the booking and process the final payment release.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800"
              onClick={() => setSelectedBooking(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmComplete}
              className="bg-emerald-500 text-white hover:bg-emerald-600 border-0"
            >
              Confirm Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
