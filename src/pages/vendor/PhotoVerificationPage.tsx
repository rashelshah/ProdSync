import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Camera, Shield, Image as ImageIcon, AlertTriangle, Check, FileImage, ShieldAlert, ScanLine } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RootState } from '@/store/store';
import { EquipmentPhotoUpload } from '@/components/photo-verification/EquipmentPhotoUpload';
import { GuidedPhotoCapture } from '@/components/photo-verification/GuidedPhotoCapture';
import { DamageDetection } from '@/components/photo-verification/DamageDetection';

const PhotoVerificationPage: React.FC = () => {
  const { equipment } = useSelector((state: RootState) => state.inventory);
  const { equipmentPhotos, damageReports } = useSelector((state: RootState) => state.photoVerification);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  const selectedEquipment = equipment.find(e => e.id === selectedEquipmentId);
  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const getEquipmentPhotoCount = (equipmentId: string) => {
    return equipmentPhotos.filter(p => p.equipmentId === equipmentId && p.type === 'pre-rental').length;
  };

  const getDamageReportStatus = (bookingId: string) => {
    const report = damageReports.find(r => r.bookingId === bookingId);
    if (!report) return null;
    return report;
  };

  const stats = {
    totalEquipment: equipment.length,
    withPhotos: equipment.filter(e => getEquipmentPhotoCount(e.id) >= 6).length,
    pendingReturns: confirmedBookings.length,
    damageReports: damageReports.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="py-4">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Photo Verification</h1>
        <p className="text-zinc-400 max-w-2xl">
          Document equipment conditions, perform AI damage analysis, and manage visual rental records.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <ImageIcon className="w-5 h-5 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalEquipment}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Total Equipment</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500 mb-1">{stats.withPhotos}</div>
            <div className="text-xs text-emerald-500/80 uppercase tracking-wider font-medium">Fully Documented</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-zinc-800 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <Camera className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.pendingReturns}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Active Rentals</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500 mb-1">{stats.damageReports}</div>
            <div className="text-xs text-orange-500/80 uppercase tracking-wider font-medium">Pending Reviews</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="bg-card/50 border border-zinc-800 p-1 rounded-xl inline-flex mb-6 h-auto">
          <TabsTrigger 
            value="upload" 
            className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 h-10 px-4"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Pre-Rental Upload
          </TabsTrigger>
          <TabsTrigger 
            value="capture" 
            className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 h-10 px-4"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            Return Capture
          </TabsTrigger>
          <TabsTrigger 
            value="damage" 
            className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 h-10 px-4"
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Damage Detection
          </TabsTrigger>
        </TabsList>

        <div className="mt-2 text-white">
          {/* Pre-Rental Photo Upload */}
          <TabsContent value="upload" className="space-y-4 m-0">
            <Card className="bg-card border-zinc-800 shadow-none">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-lg">Select Equipment</CardTitle>
                <CardDescription className="text-zinc-400">Choose equipment from inventory to upload base verification photos.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                  <SelectTrigger className="w-full sm:w-[500px] h-11 bg-zinc-950 border-zinc-800 text-white">
                    <SelectValue placeholder="Search or select equipment..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-zinc-800 text-white">
                    {equipment.map(item => {
                      const photoCount = getEquipmentPhotoCount(item.id);
                      return (
                        <SelectItem key={item.id} value={item.id} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer py-3">
                          <div className="flex items-center justify-between w-full min-w-[300px]">
                            <span className="font-medium mr-4">{item.name}</span>
                            <Badge variant="outline" className={`ml-auto border-none ${photoCount >= 6 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-300'}`}>
                              {photoCount}/6 photos
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedEquipment && (
              <EquipmentPhotoUpload
                equipmentId={selectedEquipment.id}
                equipmentName={selectedEquipment.name}
                onComplete={() => setSelectedEquipmentId('')}
              />
            )}
          </TabsContent>

          {/* Return Photo Capture */}
          <TabsContent value="capture" className="space-y-4 m-0">
            <Card className="bg-card border-zinc-800 shadow-none">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-lg">Active Rental Returns</CardTitle>
                <CardDescription className="text-zinc-400">Select a currently checked-out rental to capture return condition photos.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {confirmedBookings.length > 0 ? (
                  <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                    <SelectTrigger className="w-full sm:w-[500px] h-11 bg-zinc-950 border-zinc-800 text-white">
                      <SelectValue placeholder="Select active booking..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-zinc-800 text-white">
                      {confirmedBookings.map(booking => (
                        <SelectItem key={booking.id} value={booking.id} className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{booking.equipmentName}</span>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <span>Rented to: <span className="text-zinc-300">{booking.customerName}</span></span>
                              <span>•</span>
                              <span>Booking ID: <span className="text-zinc-400 uppercase">{booking.id.split('-')[1] || booking.id.substring(0, 8)}</span></span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-center py-10 bg-zinc-950/50 rounded-xl border border-zinc-800 border-dashed">
                    <div className="h-12 w-12 bg-card rounded-full flex items-center justify-center mx-auto mb-3 border border-zinc-800">
                      <ScanLine className="h-6 w-6 text-zinc-500" />
                    </div>
                    <p className="text-md font-medium text-white">No active rentals pending return</p>
                    <p className="text-sm text-zinc-400 mt-1">There are currently no confirmed bookings checked out.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedBooking && selectedBookingId && (
              <GuidedPhotoCapture
                equipmentId={selectedBooking.equipmentId}
                equipmentName={selectedBooking.equipmentName}
                bookingId={selectedBooking.id}
                onComplete={() => setSelectedBookingId('')}
              />
            )}
          </TabsContent>

          {/* Damage Detection */}
          <TabsContent value="damage" className="space-y-6 m-0">
            <Card className="bg-card border-zinc-800 shadow-none">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-zinc-400" />
                  AI Damage Detection
                </CardTitle>
                <CardDescription className="text-zinc-400">Run AI analysis comparing pre and post-rental photos.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                  <SelectTrigger className="w-full sm:w-[500px] h-11 bg-zinc-950 border-zinc-800 text-white">
                    <SelectValue placeholder="Select completed or in-progress rental..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-zinc-800 text-white">
                    {bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').map(booking => {
                      const report = getDamageReportStatus(booking.id);
                      return (
                        <SelectItem key={booking.id} value={booking.id} className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                          <div className="flex items-center justify-between w-full min-w-[350px]">
                            <div className="flex flex-col gap-1 mr-4">
                              <span className="font-medium">{booking.equipmentName}</span>
                              <span className="text-xs text-zinc-500">Customer: {booking.customerName}</span>
                            </div>
                            {report && (
                              <Badge className={`ml-auto shadow-none border-none ${report.damageDetected ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-800 text-zinc-300'}`}>
                                {report.status}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedBooking && selectedBookingId && (
              <DamageDetection
                equipmentId={selectedBooking.equipmentId}
                equipmentName={selectedBooking.equipmentName}
                bookingId={selectedBooking.id}
                preRentalPhotos={equipmentPhotos.filter(
                  p => p.equipmentId === selectedBooking.equipmentId && p.type === 'pre-rental'
                )}
                postRentalPhotos={equipmentPhotos.filter(
                  p => p.equipmentId === selectedBooking.equipmentId && p.type === 'post-rental'
                )}
                onComplete={() => setSelectedBookingId('')}
              />
            )}

            {/* Damage Reports List */}
            {damageReports.length > 0 && (
              <Card className="bg-card border-zinc-800 shadow-none">
                <CardHeader className="border-b border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg">Recent Damage Reports</CardTitle>
                  <CardDescription className="text-zinc-400">History of analyzed rentals.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {damageReports.slice(0, 5).map(report => {
                      const booking = bookings.find(b => b.id === report.bookingId);
                      return (
                        <div
                          key={report.id}
                          className={`p-4 rounded-xl border ${
                            report.damageDetected ? 'border-orange-500/30 bg-orange-500/5' : 'border-emerald-500/20 bg-emerald-500/5'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-white">{booking?.equipmentName || 'Unknown Equipment'}</p>
                              <p className="text-xs text-zinc-400 mt-1">
                                {new Date(report.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <Badge className={`shadow-none border-none ${report.damageDetected ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                              {report.damageDetected ? 'Damage Detected' : 'Clear'}
                            </Badge>
                          </div>
                          {report.damageDescription && (
                            <p className="text-sm text-zinc-300 mt-3 pt-3 border-t border-zinc-800">
                              {report.damageDescription}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PhotoVerificationPage;
