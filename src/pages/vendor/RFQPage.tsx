import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  addToRFQCart,
  removeFromRFQCart,
  updateRFQCartQuantity,
  clearRFQCart,
  submitRFQ,
  quoteRFQ,
  updateRFQStatus,
  seedEquipmentDatabase,
  RFQStatus,
} from '@/store/slices/cameraDepartmentSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';

export default function RFQPage() {
  const dispatch = useDispatch();
  const { rfqCart, rfqs } = useSelector((state: RootState) => state.cameraDepartment);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<string>('');
  const [quoteCost, setQuoteCost] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  
  const categories = ['all', ...new Set(seedEquipmentDatabase.map(e => e.category))];
  
  const filteredEquipment = seedEquipmentDatabase.filter(eq => {
    const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleAddToCart = (equipment: typeof seedEquipmentDatabase[0]) => {
    dispatch(addToRFQCart({
      id: `cart-${Date.now()}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      category: equipment.category,
      quantity: 1,
      dailyRate: equipment.dailyRate,
    }));
    toast.success(`Added ${equipment.name} to cart`);
  };
  
  const handleQuantityChange = (equipmentId: string, delta: number) => {
    const item = rfqCart.find(i => i.equipmentId === equipmentId);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        dispatch(removeFromRFQCart(equipmentId));
      } else {
        dispatch(updateRFQCartQuantity({ equipmentId, quantity: newQty }));
      }
    }
  };
  
  const handleSubmitRFQ = () => {
    if (!startDate || !endDate) {
      toast.error('Please select rental dates');
      return;
    }
    if (rfqCart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    dispatch(submitRFQ({
      customerId: user?.id || 'anonymous',
      customerName: user?.name || user?.email || 'Guest User',
      startDate,
      endDate,
    }));
    toast.success('RFQ submitted successfully');
  };
  
  const handleOpenQuoteDialog = (rfqId: string) => {
    setSelectedRFQ(rfqId);
    setQuoteDialogOpen(true);
  };
  
  const handleSubmitQuote = () => {
    if (!quoteCost || parseFloat(quoteCost) <= 0) {
      toast.error('Please enter a valid cost');
      return;
    }
    
    dispatch(quoteRFQ({
      rfqId: selectedRFQ,
      totalCost: parseFloat(quoteCost),
      notes: quoteNotes,
    }));
    setQuoteDialogOpen(false);
    setQuoteCost('');
    setQuoteNotes('');
    toast.success('Quote submitted to customer');
  };
  
  const getStatusBadge = (status: RFQStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'quoted':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"><FileText className="w-3 h-3 mr-1" />Quoted</Badge>;
      case 'accepted':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const cartTotal = rfqCart.reduce((sum, item) => sum + (item.dailyRate || 0) * item.quantity, 0);
  
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Rental Requests & Quotes</h1>
          <p className="text-zinc-400">View equipment catalogs and manage incoming requests.</p>
        </div>
      </div>
      
      <Tabs defaultValue="rfqs" className="space-y-6">
        <TabsList className="bg-card/50 border border-zinc-800 p-1">
          <TabsTrigger value="rfqs" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">
            RFQ Dashboard
          </TabsTrigger>
          <TabsTrigger value="browse" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">
            Create RFQ
          </TabsTrigger>
          <TabsTrigger value="cart" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 flex items-center">
            Cart 
            {rfqCart.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {rfqCart.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* RFQ Dashboard (Vendor) */}
        <TabsContent value="rfqs" className="mt-0 outline-none">
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="text-lg text-white">Incoming RFQs</CardTitle>
              <CardDescription className="text-zinc-400">Review and provide quotes for customer rental requests.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {rfqs.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 flex flex-col items-center">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p>No RFQs received yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rfqs.map(rfq => (
                    <Card key={rfq.id} className="bg-zinc-950 border-zinc-800 shadow-none flex flex-col">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white tracking-tight">{rfq.id}</h4>
                          {getStatusBadge(rfq.status)}
                        </div>
                        <p className="text-sm text-zinc-400">{rfq.customerName}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-3 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 bg-card p-2 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{rfq.rentalStartDate} to {rfq.rentalEndDate}</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Requested Items ({rfq.items.length})</p>
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                            {rfq.items.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b border-zinc-800/50 last:border-0">
                                <span className="text-zinc-300 truncate pr-2">{item.equipmentName}</span>
                                <span className="text-zinc-500 font-mono text-xs">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-4 space-y-3">
                          {rfq.totalCost && (
                            <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-zinc-800">
                              <span className="text-sm font-medium text-zinc-400">Quoted Price</span>
                              <span className="font-bold text-white flex items-center">
                                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                {rfq.totalCost.toLocaleString()}
                              </span>
                            </div>
                          )}
                          
                          {rfq.status === 'pending' && (
                            <Button
                              className="w-full bg-white text-zinc-950 hover:bg-zinc-200"
                              onClick={() => handleOpenQuoteDialog(rfq.id)}
                            >
                              Provide Quote
                            </Button>
                          )}
                          
                          {rfq.status === 'quoted' && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1 bg-transparent border-zinc-800 text-zinc-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                                onClick={() => dispatch(updateRFQStatus({ rfqId: rfq.id, status: 'rejected' }))}
                              >
                                Reject
                              </Button>
                              <Button
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                                onClick={() => dispatch(updateRFQStatus({ rfqId: rfq.id, status: 'accepted' }))}
                              >
                                Accept
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Equipment */}
        <TabsContent value="browse" className="mt-0 outline-none">
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
              <CardTitle className="text-lg text-white">Equipment Catalog</CardTitle>
              <CardDescription className="text-zinc-400">Select items to build a rental request.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="Search equipment..."
                    className="pl-9 bg-zinc-950 border-zinc-800 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-zinc-950 border-zinc-800 text-white">
                    <Filter className="w-4 h-4 mr-2 text-zinc-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-zinc-800 text-white">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="hover:bg-zinc-800 focus:bg-zinc-800 capitalize">
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEquipment.map(equipment => {
                  const inCart = rfqCart.find(i => i.equipmentId === equipment.id);
                  return (
                    <Card key={equipment.id} className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors shadow-none">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-white tracking-tight">{equipment.name}</h3>
                            <Badge className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 mt-2 font-normal capitalize border-none">{equipment.category}</Badge>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                          <div>
                            <h4 className="text-xl font-bold text-white leading-none">₹{equipment.dailyRate.toLocaleString()}</h4>
                            <p className="text-xs text-zinc-500 mt-1">per day</p>
                          </div>
                          {inCart ? (
                            <div className="flex items-center bg-card border border-zinc-800 rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white"
                                onClick={() => handleQuantityChange(equipment.id, -1)}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </Button>
                              <span className="w-6 text-center text-sm font-medium text-white">{inCart.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white"
                                onClick={() => handleQuantityChange(equipment.id, 1)}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800" onClick={() => handleAddToCart(equipment)}>
                              <Plus className="w-4 h-4 mr-1.5" /> Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Cart */}
        <TabsContent value="cart" className="mt-0 outline-none">
          {rfqCart.length === 0 ? (
            <Card className="bg-card border-zinc-800 shadow-none">
              <CardContent className="p-16 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                  <ShoppingCart className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Your cart is empty</h3>
                <p className="text-zinc-400 max-w-sm">Browse equipment and add items to your cart to create a new RFQ.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="bg-card border-zinc-800 shadow-none lg:col-span-2">
                <CardHeader className="border-b border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg text-white flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-zinc-400" />
                    Cart Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {rfqCart.map(item => (
                    <div
                      key={item.equipmentId}
                      className="flex sm:items-center flex-col sm:flex-row justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl gap-4"
                    >
                      <div>
                        <h4 className="font-medium text-white">{item.equipmentName}</h4>
                        <p className="text-xs text-zinc-500 capitalize mt-1">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6">
                        <div className="flex items-center bg-card border border-zinc-800 rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white"
                            onClick={() => handleQuantityChange(item.equipmentId, -1)}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white"
                            onClick={() => handleQuantityChange(item.equipmentId, 1)}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white flex items-center justify-end">
                            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                            {((item.dailyRate || 0) * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-zinc-500">/day</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => dispatch(removeFromRFQCart(item.equipmentId))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-6 px-2">
                    <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Estimated Daily Total</span>
                    <span className="text-2xl font-bold flex items-center text-white">
                      <IndianRupee className="w-5 h-5 mr-1" />
                      {cartTotal.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-zinc-800 shadow-none h-fit">
                <CardHeader className="border-b border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-zinc-400" />
                    Rental Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Start Date</Label>
                      <Input
                        type="date"
                        className="bg-zinc-950 border-zinc-800 text-white css-invert-calendar-icon"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300">End Date</Label>
                      <Input
                        type="date"
                        className="bg-zinc-950 border-zinc-800 text-white css-invert-calendar-icon"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800/50">
                    <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200" onClick={handleSubmitRFQ}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit RFQ
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      onClick={() => dispatch(clearRFQCart())}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="bg-card border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Provide Quote</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter the final total cost for this rental request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Total Cost (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-9 bg-zinc-950 border-zinc-800 text-white"
                  value={quoteCost}
                  onChange={(e) => setQuoteCost(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Notes for Customer (optional)</Label>
              <Textarea
                placeholder="Discounts applied, included items, etc..."
                className="bg-zinc-950 border-zinc-800 text-white min-h-[100px] resize-none"
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800" onClick={() => setQuoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={handleSubmitQuote}>
              Submit Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
