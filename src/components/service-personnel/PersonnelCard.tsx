import React from 'react';
import { Star, Phone, Mail, Calendar, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ServicePersonnel } from '@/store/slices/servicePersonnelSlice';

interface PersonnelCardProps {
  personnel: ServicePersonnel;
  onEdit?: (personnel: ServicePersonnel) => void;
  onDelete?: (id: string) => void;
  onSelect?: (personnel: ServicePersonnel) => void;
  selectable?: boolean;
  selected?: boolean;
}

export const PersonnelCard: React.FC<PersonnelCardProps> = ({
  personnel,
  onEdit,
  onDelete,
  onSelect,
  selectable = false,
  selected = false,
}) => {
  const getAvailabilityBadge = () => {
    switch (personnel.availability) {
      case 'available':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500/20 shadow-none">Available</Badge>;
      case 'booked':
        return <Badge className="bg-amber-500/10 text-amber-500 border-none hover:bg-amber-500/20 shadow-none">Booked</Badge>;
      case 'unavailable':
        return <Badge className="bg-zinc-800 text-zinc-400 border-none hover:bg-zinc-700 shadow-none">Unavailable</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      className={`transition-all duration-300 bg-zinc-900 border-zinc-800 shadow-none overflow-hidden ${
        selectable ? 'cursor-pointer hover:border-zinc-700' : ''
      } ${selected ? 'border-blue-500 ring-1 ring-blue-500/50' : ''}`}
      onClick={() => selectable && onSelect?.(personnel)}
    >
      <div className="h-16 bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-800/50 relative">
        <div className="absolute right-3 top-3">
          {getAvailabilityBadge()}
        </div>
      </div>
      <CardContent className="p-5 pt-0 relative">
        <div className="flex flex-col mb-4">
          <Avatar className="h-20 w-20 border-4 border-zinc-900 -mt-10 mb-3 bg-zinc-800">
            <AvatarImage src={personnel.profilePhoto} alt={personnel.name} className="object-cover" />
            <AvatarFallback className="text-xl bg-zinc-800 text-zinc-300 font-medium">{getInitials(personnel.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex items-start justify-between min-w-0">
            <div>
              <h3 className="font-bold text-lg text-white truncate leading-tight tracking-tight">{personnel.name}</h3>
              <p className="text-sm font-medium text-blue-500 mt-0.5">{personnel.role}</p>
            </div>
            
            <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold text-white text-xs">{personnel.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {personnel.specializations.slice(0, 3).map(spec => (
              <Badge key={spec} variant="outline" className="text-[10px] bg-zinc-950/50 border-zinc-800 text-zinc-300 font-normal uppercase tracking-wider py-0 px-1.5">
                {spec}
              </Badge>
            ))}
            {personnel.specializations.length > 3 && (
              <Badge variant="outline" className="text-[10px] bg-zinc-950/50 border-zinc-800 text-zinc-400 font-normal">
                +{personnel.specializations.length - 3}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Rate</p>
              <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                <span>₹{personnel.dailyRate.toLocaleString()}<span className="text-zinc-500 text-xs font-normal">/d</span></span>
              </div>
            </div>
            <div className="space-y-1 pr-2 border-l border-zinc-800 pl-3">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Exp</p>
              <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                <span className="truncate">{personnel.experience}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs text-zinc-400 pt-1">
            {personnel.phone && (
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-zinc-500" />
                {personnel.phone}
              </span>
            )}
            {personnel.email && (
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                <span className="truncate">{personnel.email}</span>
              </span>
            )}
          </div>
        </div>

        {(onEdit || onDelete) && !selectable && (
          <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-800/80">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-800 h-9"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(personnel);
                }}
              >
                <Edit className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 bg-transparent border-zinc-700 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(personnel.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
