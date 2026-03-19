import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateRFQStatus } from '@/store/slices/cameraDepartmentSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar,
  IndianRupee,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CustomerRFQPage = () => {
  const dispatch = useDispatch();
  const { rfqs } = useSelector((state: RootState) => state.cameraDepartment);

  // Filter RFQs for current customer (in real app, filter by customer ID)
  const customerRfqs = rfqs;

  const pendingRfqs = customerRfqs.filter(r => r.status === 'pending');
  const quotedRfqs = customerRfqs.filter(r => r.status === 'quoted');
  const acceptedRfqs = customerRfqs.filter(r => r.status === 'accepted');
  const rejectedRfqs = customerRfqs.filter(r => r.status === 'rejected');

  const handleAccept = (rfqId: string) => {
    dispatch(updateRFQStatus({ rfqId, status: 'accepted' }));
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
    
    toast.success('Quote accepted! Vendor will be notified.');
  };

  const handleReject = (rfqId: string) => {
    dispatch(updateRFQStatus({ rfqId, status: 'rejected' }));
    toast.info('Quote rejected.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-zinc-800 text-zinc-300 border-none"><Clock className="mr-1.5 h-3 w-3" />Pending</Badge>;
      case 'quoted':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><IndianRupee className="mr-1.5 h-3 w-3" />Quoted</Badge>;
      case 'accepted':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="mr-1.5 h-3 w-3" />Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="mr-1.5 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const RFQCard = ({ rfq }: { rfq: typeof rfqs[0] }) => (
    <Card className="mb-4 bg-card border-zinc-800 shadow-none">
      <CardHeader className="pb-4 border-b border-zinc-800/50">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-white font-semibold">{rfq.id}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1.5 text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(rfq.rentalStartDate), 'MMM d')} - {format(new Date(rfq.rentalEndDate), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          {getStatusBadge(rfq.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {/* Items */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Package className="h-4 w-4 text-zinc-500" />
            Requested Items ({rfq.items.length})
          </p>
          <div className="bg-zinc-950 rounded-lg p-3 space-y-1.5 border border-zinc-800/80">
            {rfq.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-zinc-300">{item.equipmentName}</span>
                <span className="text-zinc-500 font-mono text-xs bg-card px-1.5 py-0.5 rounded">x{item.quantity}</span>
              </div>
            ))}
            {rfq.items.length > 3 && (
              <p className="text-xs text-blue-500 font-medium pt-2 mt-2 border-t border-zinc-800/50">
                +{rfq.items.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Quote Details */}
        {rfq.status === 'quoted' && rfq.totalCost && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-blue-400 text-sm uppercase tracking-wider">Quoted Price</p>
              <p className="text-2xl font-bold text-white flex items-center">
                <IndianRupee className="w-5 h-5 mr-0.5 mt-0.5" />
                {rfq.totalCost.toLocaleString()}
              </p>
            </div>
            {rfq.vendorNotes && (
              <div className="mt-3 pt-3 border-t border-blue-500/10">
                <p className="text-sm text-zinc-400 leading-relaxed"><span className="text-zinc-300 font-medium">Notes: </span>{rfq.vendorNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Accepted Quote */}
        {rfq.status === 'accepted' && rfq.totalCost && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <p className="font-medium text-emerald-500">Booking Confirmed</p>
            </div>
            <p className="text-2xl font-bold text-white flex items-center mt-3">
              <IndianRupee className="w-5 h-5 mr-0.5 mt-0.5" />
              {rfq.totalCost.toLocaleString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {rfq.status === 'quoted' && (
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => handleReject(rfq.id)}
              className="flex-1 h-12 bg-transparent border-zinc-700 text-zinc-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject Offer
            </Button>
            <Button
              onClick={() => handleAccept(rfq.id)}
              className="flex-1 h-12 bg-white text-zinc-950 hover:bg-zinc-200"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept Quote
            </Button>
          </div>
        )}

        {/* Created Date */}
        <p className="text-xs text-zinc-600 text-right pt-2">
          Submitted {format(new Date(rfq.createdAt), 'MMM d, yyyy h:mm a')}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">My Quote Requests</h1>
        <p className="text-zinc-400 text-sm">
          Track your equipment rental requests and manage incoming vendor quotes.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <Clock className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingRfqs.length}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-0.5">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{quotedRfqs.length}</p>
              <p className="text-xs text-blue-500 uppercase tracking-wider font-medium mt-0.5">Quoted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{acceptedRfqs.length}</p>
              <p className="text-xs text-emerald-500 uppercase tracking-wider font-medium mt-0.5">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{rejectedRfqs.length}</p>
              <p className="text-xs text-red-500 uppercase tracking-wider font-medium mt-0.5">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="quoted" className="space-y-4 w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-zinc-800 p-1 mb-6">
          <TabsTrigger value="quoted" className="relative data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">
            Quoted
            {quotedRfqs.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                {quotedRfqs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">Pending</TabsTrigger>
          <TabsTrigger value="accepted" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">Accepted</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">All Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="quoted" className="mt-0 outline-none">
          <ScrollArea className="h-[calc(100vh-360px)] pr-4 custom-scrollbar">
            {quotedRfqs.length === 0 ? (
              <Card className="bg-card border-zinc-800 border-dashed shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <IndianRupee className="h-8 w-8 text-zinc-500" />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">No quotes to review</p>
                  <p className="text-sm text-zinc-400">Vendors are currently reviewing your pending requests.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {quotedRfqs.map(rfq => <RFQCard key={rfq.id} rfq={rfq} />)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="pending" className="mt-0 outline-none">
          <ScrollArea className="h-[calc(100vh-360px)] pr-4 custom-scrollbar">
            {pendingRfqs.length === 0 ? (
              <Card className="bg-card border-zinc-800 border-dashed shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <Clock className="h-8 w-8 text-zinc-500" />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">No pending requests</p>
                  <p className="text-sm text-zinc-400">All your requests have been quoted or processed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {pendingRfqs.map(rfq => <RFQCard key={rfq.id} rfq={rfq} />)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="accepted" className="mt-0 outline-none">
          <ScrollArea className="h-[calc(100vh-360px)] pr-4 custom-scrollbar">
            {acceptedRfqs.length === 0 ? (
               <Card className="bg-card border-zinc-800 border-dashed shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <CheckCircle2 className="h-8 w-8 text-zinc-500" />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">No accepted quotes yet</p>
                  <p className="text-sm text-zinc-400">Review your quotes and accept one to secure your booking.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {acceptedRfqs.map(rfq => <RFQCard key={rfq.id} rfq={rfq} />)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="all" className="mt-0 outline-none">
          <ScrollArea className="h-[calc(100vh-360px)] pr-4 custom-scrollbar">
            {customerRfqs.length === 0 ? (
              <Card className="bg-card border-zinc-800 border-dashed shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <FileText className="h-8 w-8 text-zinc-500" />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">No RFQs submitted yet</p>
                  <p className="text-sm text-zinc-400">Browse equipment to build and submit your first quote request.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {customerRfqs.map(rfq => <RFQCard key={rfq.id} rfq={rfq} />)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerRFQPage;
