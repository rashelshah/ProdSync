import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserPlus, Upload, X, Save, Send, Mail, Phone, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { addPersonnel, ServicePersonnel } from '@/store/slices/servicePersonnelSlice';

interface AddPersonnelFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const roles = [
  'Chief Technician',
  'Lightman',
  'Camera Assistant',
  'Grip',
  'Sound Engineer',
  'DIT (Digital Imaging Technician)',
  'Gaffer',
  'Focus Puller',
  'Drone Operator',
  'Steadicam Operator',
];

const idProofTypes = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
];

export const AddPersonnelForm: React.FC<AddPersonnelFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    idProofType: '' as ServicePersonnel['idProofType'] | '',
    idProofNumber: '',
    dailyRate: '',
    hourlyRate: '',
    experience: '',
    specializations: [] as string[],
  });
  const [idProofDocument, setIdProofDocument] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [inviteViaEmail, setInviteViaEmail] = useState(true);
  const [inviteViaSms, setInviteViaSms] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'idProof' | 'profile') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (type === 'idProof') {
        setIdProofDocument(dataUrl);
      } else {
        setProfilePhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const addSpecialization = () => {
    if (newSpecialization && !formData.specializations.includes(newSpecialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization],
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec),
    }));
  };

  const sendInvite = async (name: string, email: string, phone: string) => {
    setIsSending(true);
    // Simulate sending invite
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const channels: string[] = [];
    if (inviteViaEmail && email) channels.push(`email (${email})`);
    if (inviteViaSms && phone) channels.push(`SMS (${phone})`);
    
    setIsSending(false);
    
    if (channels.length > 0) {
      toast({
        title: 'Invite sent! 📩',
        description: `App invite sent to ${name} via ${channels.join(' and ')}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.idProofType || !formData.idProofNumber) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if ((inviteViaEmail && !formData.email) || (inviteViaSms && !formData.phone)) {
      toast({
        title: 'Contact info required',
        description: 'Please provide email/phone for the selected invite method',
        variant: 'destructive',
      });
      return;
    }

    const personnel: ServicePersonnel = {
      id: `sp-${Date.now()}`,
      vendorId: 'vendor-1',
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      idProofType: formData.idProofType as ServicePersonnel['idProofType'],
      idProofNumber: formData.idProofNumber,
      idProofDocument: idProofDocument || undefined,
      profilePhoto: profilePhoto || undefined,
      dailyRate: parseFloat(formData.dailyRate) || 0,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      specializations: formData.specializations,
      experience: formData.experience,
      availability: 'available',
      rating: 0,
      totalJobs: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addPersonnel(personnel));
    
    toast({
      title: 'Personnel added',
      description: `${formData.name} has been added to your service team`,
    });

    // Send invite
    if (inviteViaEmail || inviteViaSms) {
      await sendInvite(formData.name, formData.email, formData.phone);
    }

    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 relative group">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-950">
                <UserCircle2 className="h-10 w-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileUpload(e, 'profile')}
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-medium text-white mb-1">Profile Photo</h3>
            <p className="text-sm text-zinc-400 mb-4 max-w-sm">Upload a professional photo. We recommend a 1:1 aspect ratio under 5MB.</p>
            <div className="flex justify-center sm:justify-start gap-3">
              <Button type="button" variant="outline" className="bg-transparent border-zinc-700 hover:bg-zinc-800 relative shadow-none">
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4 text-zinc-400" />
                  Select File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, 'profile')}
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Name */}
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-zinc-300">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. John Doe"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2.5">
            <Label htmlFor="role" className="text-zinc-300">Role <span className="text-red-500">*</span></Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                <SelectValue placeholder="Select primary role" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {roles.map(role => (
                  <SelectItem key={role} value={role} className="hover:bg-zinc-800 focus:bg-zinc-800">{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4 pb-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Rates & Experience</h4>
          </div>

          {/* Daily Rate */}
          <div className="space-y-2.5">
            <Label htmlFor="dailyRate" className="text-zinc-300">Daily Rate (₹)</Label>
            <Input
              id="dailyRate"
              type="number"
              value={formData.dailyRate}
              onChange={(e) => handleInputChange('dailyRate', e.target.value)}
              placeholder="e.g. 2500"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2.5">
            <Label htmlFor="experience" className="text-zinc-300">Experience</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="e.g. 5+ years"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
            />
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <Label className="text-zinc-300">Specializations</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Enter skill (e.g. Underwater Filming)"
                className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" variant="secondary" onClick={addSpecialization} className="bg-zinc-800 hover:bg-zinc-700 text-white">
                Add
              </Button>
            </div>
            {formData.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800/50">
                {formData.specializations.map(spec => (
                  <Badge key={spec} variant="outline" className="gap-1.5 py-1 px-2.5 bg-zinc-900 border-zinc-700 text-zinc-300 font-normal">
                    {spec}
                    <button type="button" onClick={() => removeSpecialization(spec)} className="text-zinc-500 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 pt-4 pb-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Verification details</h4>
          </div>

          {/* ID Proof Type */}
          <div className="space-y-2.5">
            <Label htmlFor="idProofType" className="text-zinc-300">ID Proof Type <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.idProofType} 
              onValueChange={(value) => handleInputChange('idProofType', value)}
            >
              <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {idProofTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="hover:bg-zinc-800 focus:bg-zinc-800">{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ID Proof Number */}
          <div className="space-y-2.5">
            <Label htmlFor="idProofNumber" className="text-zinc-300">ID Document Number <span className="text-red-500">*</span></Label>
            <Input
              id="idProofNumber"
              value={formData.idProofNumber}
              onChange={(e) => handleInputChange('idProofNumber', e.target.value)}
              placeholder="Enter ID number"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 font-mono uppercase"
              required
            />
          </div>

          {/* ID Proof Document Upload */}
          <div className="space-y-2.5 md:col-span-2">
            <Label className="text-zinc-300">Upload ID Document Image</Label>
            <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 rounded-xl p-6 transition-colors">
              {idProofDocument ? (
                <div className="relative inline-flex flex-col items-center w-full">
                  <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                    <img src={idProofDocument} alt="ID Proof" className="max-h-40 rounded object-contain" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIdProofDocument(null)}
                    className="mt-4 bg-transparent border-zinc-700 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Document
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full">
                  <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
                    <Upload className="h-5 w-5 text-zinc-400" />
                  </div>
                  <span className="text-sm font-medium text-white mb-1">Upload Scanned Copy</span>
                  <span className="text-xs text-zinc-500 text-center max-w-xs">Supported formats: JPG, PNG, PDF.<br/>Max file size: 10MB.</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'idProof')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Invite Options */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white mb-1">
            <Send className="h-4 w-4 text-blue-500" />
            Send Crew App Invitation
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            Send an onboarding link to the personnel to download the Crew App and accept the invite.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 bg-zinc-900/50 p-3 rounded-lg border border-blue-500/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={inviteViaEmail}
                onCheckedChange={(checked) => setInviteViaEmail(!!checked)}
                className="border-blue-500/50 data-[state=checked]:bg-blue-500"
              />
              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <Mail className="h-4 w-4 text-zinc-500" />
                Email
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={inviteViaSms}
                onCheckedChange={(checked) => setInviteViaSms(!!checked)}
                className="border-blue-500/50 data-[state=checked]:bg-blue-500"
              />
              <span className="flex items-center gap-2 text-sm text-zinc-300">
                <Phone className="h-4 w-4 text-zinc-500" />
                SMS / WhatsApp
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-zinc-800">
          {onCancel && (
            <Button type="button" variant="outline" className="sm:flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-800 h-11" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white h-11" disabled={isSending}>
            {isSending ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-pulse" />
                Sending Invite...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Personnel & Send Invite
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
