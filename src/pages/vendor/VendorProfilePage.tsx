import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, MapPin, Edit2, Save, X, Star, Package, TrendingUp, CheckCircle2, Factory, FileText, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { KycBadge } from '@/components/kyc/KycBadge';

export const VendorProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  
  const [profileData, setProfileData] = useState({
    businessName: 'ProdSync Rentals',
    email: user?.email || 'vendor@prodsync.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    description: 'Professional film equipment rental service with 5+ years of experience. Specializing in high-end cameras, lighting, and grip equipment.',
    gst: 'GST123456789',
  });

  const stats = [
    { label: 'Total Equipment', value: '24', icon: Package },
    { label: 'Active Rentals', value: '12', icon: TrendingUp },
    { label: 'Average Rating', value: '4.8', icon: Star },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Vendor Profile</h1>
          <p className="text-zinc-400">Manage your business settings, verification, and public profile.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 items-start">
        {/* Left Column - Navigation & Overview */}
        <div className="space-y-6 md:col-span-1">
          {/* Profile Card */}
          <Card className="bg-card border-zinc-800 shadow-none overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-zinc-800 to-zinc-950 border-b border-zinc-800"></div>
            <CardContent className="pt-0 px-5 pb-5">
              <div className="flex flex-col items-center text-center -mt-12 space-y-3">
                <Avatar className="h-24 w-24 border-4 border-zinc-900 bg-zinc-800">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl font-bold text-white bg-zinc-800">
                    {profileData.businessName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">{profileData.businessName}</h2>
                  <p className="text-sm text-blue-500 font-medium mt-0.5">{profileData.email}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <Badge variant="outline" className="bg-zinc-950/50 border-zinc-700 text-zinc-300 shadow-none">
                    <Building2 className="mr-1.5 h-3 w-3 text-zinc-400" />
                    Verified Vendor
                  </Badge>
                  <KycBadge isVerified={user?.kycStatus === 'approved'} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Menu (Replaces TabsList for a cleaner layout) */}
          <nav className="flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'business' 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Factory className="h-4 w-4" />
              Business Settings
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'documents' 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <FileText className="h-4 w-4" />
              Documents & KYC
            </button>
            <button 
              onClick={() => setActiveTab('banking')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'banking' 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Banking Info
            </button>
          </nav>
          
          <Card className="bg-card border-zinc-800 shadow-none">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-0">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-zinc-800 p-1.5 rounded-md">
                      <stat.icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content Area */}
        <div className="md:col-span-3">
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Business Settings</h3>
                  <p className="text-sm text-zinc-400">Update your company details and contact info.</p>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <Card className="bg-card border-zinc-800 shadow-none">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="businessName" className="text-zinc-300">Business Name</Label>
                    <Input
                      id="businessName"
                      value={profileData.businessName}
                      onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                      disabled={!isEditing}
                      className="bg-zinc-950 border-zinc-800 text-white disabled:opacity-70 disabled:bg-zinc-950 h-11 transition-all"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10 bg-zinc-950 border-zinc-800 text-white disabled:opacity-70 disabled:bg-zinc-950 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10 bg-zinc-950 border-zinc-800 text-white disabled:opacity-70 disabled:bg-zinc-950 h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-zinc-300">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-zinc-950 border-zinc-800 text-white disabled:opacity-70 disabled:bg-zinc-950 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-zinc-300">Business Description</Label>
                    <Textarea
                      id="description"
                      value={profileData.description}
                      onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      className="bg-zinc-950 border-zinc-800 text-white disabled:opacity-70 disabled:bg-zinc-950 resize-none p-3"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-800/80">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tax & Verification</h4>
                    <div className="space-y-3 md:w-1/2">
                      <Label htmlFor="gst" className="text-zinc-300">GST Registration Number</Label>
                      <Input
                        id="gst"
                        value={profileData.gst}
                        onChange={(e) => setProfileData({ ...profileData, gst: e.target.value })}
                        disabled={!isEditing}
                        className="bg-zinc-950 border-zinc-800 text-white font-mono uppercase disabled:opacity-70 h-11"
                      />
                    </div>
                  </div>
                </CardContent>
                
                {isEditing && (
                  <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 p-4 flex justify-end gap-3 rounded-b-xl">
                    <Button variant="outline" onClick={handleCancel} className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white">
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Documents & KYC</h3>
                <p className="text-sm text-zinc-400">Manage your verification documents and identity proofs.</p>
              </div>
              <Card className="bg-card border-zinc-800 shadow-none">
                <CardContent className="p-12 text-center text-zinc-400">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                    <FileText className="w-6 h-6 text-zinc-500" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Document Management Area</h4>
                  <p className="max-w-md mx-auto">This section allows you to upload business registration, identity proof, and verification documents.</p>
                  <Button variant="outline" className="mt-6 bg-transparent border-zinc-700 text-white hover:bg-zinc-800">Upload Document</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Banking Information</h3>
                <p className="text-sm text-zinc-400">Manage your payout accounts and billing details.</p>
              </div>
              <Card className="bg-card border-zinc-800 shadow-none">
                <CardContent className="p-12 text-center text-zinc-400">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                    <CreditCard className="w-6 h-6 text-zinc-500" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Secure Banking Portal</h4>
                  <p className="max-w-md mx-auto">Connect your bank accounts to receive payouts from rentals directly.</p>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-500 text-white">Connect Bank Account</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
