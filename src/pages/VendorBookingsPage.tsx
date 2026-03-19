import React, { useState } from 'react';
import { Calendar, Clock, User, Package, CheckCircle, XCircle, MapPin, Truck, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateBookingStatus, addNotification } from '@/store/slices/bookingsSlice';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { EnhancedRatingModal } from '@/components/ratings/EnhancedRatingModal';
import { generateInvoice } from '@/lib/invoiceGenerator';
import { notifyBookingAccepted, notifyBookingRejected, notifyInvoiceGenerated, notifyPaymentStatus } from '@/lib/notificationSystem';
import { InvoiceCard } from '@/components/bookings/InvoiceCard';
import { PaymentTracker } from '@/components/bookings/PaymentTracker';

export const VendorBookingsPage: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const [activeTab, setActiveTab] = useState('pending');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleAccept = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const days = Math.ceil(
      (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) 
      / (1000 * 60 * 60 * 24)
    ) + 1;
    const dailyRate = booking.totalAmount / days;

    const invoice = generateInvoice(
      booking.id,
      booking.equipmentName,
      booking.customerName,
      booking.startDate,
      booking.endDate,
      dailyRate,
      (booking as any).quantity || 1
    );

    dispatch(updateBookingStatus({ 
      id: bookingId, 
      status: 'confirmed',
      invoice,
      paymentStatus: 'held_in_escrow'
    }));

    const bookingNotif = notifyBookingAccepted(booking.equipmentName, invoice.referenceNumber, bookingId);
    const invoiceNotif = notifyInvoiceGenerated(invoice.referenceNumber, bookingId);
    const paymentNotif = notifyPaymentStatus('held_in_escrow', booking.totalAmount, bookingId);
    
    dispatch(addNotification(bookingNotif));
    dispatch(addNotification(invoiceNotif));
    dispatch(addNotification(paymentNotif));

    toast({
      title: "Booking Accepted ✓",
      description: `Invoice ${invoice.referenceNumber} generated. Payment held in escrow.`,
    });
  };

  const handleReject = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    dispatch(updateBookingStatus({ id: bookingId, status: 'cancelled' }));
    
    if (booking) {
      const rejectNotif = notifyBookingRejected(booking.equipmentName, bookingId);
      dispatch(addNotification(rejectNotif));
    }

    toast({
      title: "Booking Rejected",
      description: "The renter has been notified.",
      variant: "destructive",
    });
  };

  const handleLeaveReview = (booking: any) => {
    setSelectedBooking(booking);
    setRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedBooking(null);
  };

  const getFilteredBookings = (filter: string) => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => b.status === filter);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Pending Request</Badge>;
      case 'confirmed':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-zinc-400 border-zinc-700">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const filteredBookings = getFilteredBookings(activeTab);

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Rental Bookings</h1>
        <p className="text-zinc-400 text-sm">
          Manage incoming rental requests, active bookings, and history.
        </p>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Pending Requests</p>
                <p className="text-3xl font-bold text-white mt-1">{bookings.filter(b => b.status === 'pending').length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Confirmed</p>
                <p className="text-3xl font-bold text-white mt-1">{bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Completed</p>
                <p className="text-3xl font-bold text-white mt-1">{bookings.filter(b => b.status === 'completed').length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">
                  ₹{bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOOKINGS LIST */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card/50 border border-zinc-800 p-1 w-full sm:w-auto overflow-x-auto justify-start h-auto">
          <TabsTrigger value="pending" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 rounded-lg px-4 py-2">
            Pending <Badge className="ml-2 bg-amber-500 border-none text-white hover:bg-amber-600">{bookings.filter(b => b.status === 'pending').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 rounded-lg px-4 py-2">
            Confirmed <Badge className="ml-2 bg-emerald-500 border-none text-white hover:bg-emerald-600">{bookings.filter(b => b.status === 'confirmed').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 rounded-lg px-4 py-2">
            Completed <Badge className="ml-2 bg-blue-500 border-none text-white hover:bg-blue-600">{bookings.filter(b => b.status === 'completed').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 rounded-lg px-4 py-2">
            All Bookings <span className="ml-2 text-xs text-zinc-500">{bookings.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6 outline-none">
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-zinc-800 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700">
                <Calendar className="h-5 w-5 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
              <p className="text-zinc-400 text-sm text-center max-w-sm">
                {activeTab === 'pending' 
                  ? "You're all caught up! No pending booking requests at the moment."
                  : `There are no ${activeTab} bookings to display right now.`
                }
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-card border-zinc-800 shadow-none overflow-hidden hover:border-zinc-700 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* INFO SECTION */}
                    <div className="flex-1 p-6 space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{booking.equipmentName}</h3>
                          <div className="flex items-center gap-2 text-zinc-400 bg-zinc-950 w-max px-3 py-1.5 rounded-full border border-zinc-800 text-sm font-medium">
                            <User className="h-4 w-4 text-blue-500" />
                            <span>{booking.customerName}</span>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/50">
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium flex flex-col gap-1">
                            <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1"/> Rental Period</span>
                          </p>
                          <p className="text-sm font-medium text-zinc-300">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium flex flex-col gap-1">
                            <span className="flex items-center"><Package className="h-3.5 w-3.5 mr-1"/> Quantity</span>
                          </p>
                          <p className="text-sm font-medium text-zinc-300">{(booking as any).quantity || 1} units</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium flex flex-col gap-1">
                            <span className="flex items-center">
                              {(booking as any).deliveryOption === 'delivery' ? <Truck className="h-3.5 w-3.5 mr-1" /> : <MapPin className="h-3.5 w-3.5 mr-1" />}
                              Delivery
                            </span>
                          </p>
                          <p className="text-sm font-medium text-zinc-300">
                            {(booking as any).deliveryOption === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium flex flex-col gap-1">
                            <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1"/> Requested On</span>
                          </p>
                          <p className="text-sm font-medium text-zinc-300">{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* SIDE PANEL (ACTIONS / PAYMENT) */}
                    <div className="w-full lg:w-80 bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 flex flex-col">
                      <div className="mb-6 flex justify-between items-end">
                        <span className="text-sm font-medium text-zinc-500">Total Price</span>
                        <span className="text-3xl font-bold text-white tracking-tight">₹{booking.totalAmount.toLocaleString()}</span>
                      </div>

                      <div className="mt-auto space-y-4">
                        {(booking.status === 'confirmed' || booking.status === 'completed') && booking.invoice && (
                          <div className="space-y-4">
                            <InvoiceCard 
                              invoice={booking.invoice}
                              customerName={booking.customerName}
                              equipmentName={booking.equipmentName}
                            />
                            <PaymentTracker booking={booking} />
                          </div>
                        )}

                        {booking.status === 'pending' && (
                          <div className="flex gap-3">
                            <Button onClick={() => handleAccept(booking.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                              <CheckCircle className="mr-2 h-4 w-4" /> Accept
                            </Button>
                            <Button onClick={() => handleReject(booking.id)} variant="outline" className="flex-1 bg-transparent border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400">
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                          </div>
                        )}
                        
                        {booking.status === 'completed' && !(booking as any).vendorReviewed && (
                          <Button onClick={() => handleLeaveReview(booking)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                            <Star className="mr-2 h-4 w-4" /> Leave Customer Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* RATING MODAL */}
      {selectedBooking && (
        <EnhancedRatingModal
          isOpen={ratingModalOpen}
          onClose={handleCloseRatingModal}
          bookingId={selectedBooking.id}
          equipmentName={selectedBooking.equipmentName}
          otherPartyName={selectedBooking.customerName}
          userRole="vendor"
        />
      )}
    </div>
  );
};
