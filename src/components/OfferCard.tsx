import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { MapPin, Clock, Lock, Ticket, RotateCw, Gift } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface OfferCardProps {
  offer: any;
  onInteract?: () => void;
}

const typeConfig = {
  scratch: { label: 'Scratch Card', icon: Ticket, className: 'offer-badge-scratch' },
  spin: { label: 'Spin Wheel', icon: RotateCw, className: 'offer-badge-spin' },
  direct: { label: 'Coupon', icon: Gift, className: 'offer-badge-direct' },
};

export function OfferCard({ offer, onInteract }: OfferCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const config = typeConfig[offer.offer_type as keyof typeof typeConfig];
  const Icon = config.icon;
  const daysLeft = differenceInDays(new Date(offer.end_date), new Date());

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Banner */}
      <div className="aspect-[2/1] bg-muted relative overflow-hidden">
        {offer.banner_url ? (
          <img src={offer.banner_url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
            <Icon className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}

        <Badge className={`absolute top-3 left-3 ${config.className} text-xs px-2 py-0.5 rounded-full`}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>

        {daysLeft <= 3 && daysLeft >= 0 && (
          <Badge variant="destructive" className="absolute top-3 right-3 text-xs">
            <Clock className="w-3 h-3 mr-1" /> {daysLeft === 0 ? 'Last day!' : `${daysLeft}d left`}
          </Badge>
        )}

        {/* Lock overlay for guests */}
        {!user && (
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-primary-foreground" />
            <span className="text-xs text-primary-foreground font-medium">Login to unlock</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-sm line-clamp-2">{offer.title}</h3>

        {offer.discount_text && (
          <p className="text-primary font-semibold text-sm">{offer.discount_text}</p>
        )}

        {offer.shop && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{offer.shop.name}</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3" /> {offer.shop.node?.name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Valid till {format(new Date(offer.end_date), 'dd MMM yyyy')}</span>
        </div>

        <div className="pt-2">
          {user ? (
            <Button
              size="sm"
              className="w-full active:scale-[0.97]"
              onClick={(e) => {
                e.preventDefault();
                onInteract?.();
              }}
            >
              {offer.offer_type === 'scratch' ? 'Scratch Now' :
               offer.offer_type === 'spin' ? 'Spin to Win' : 'Unlock Offer'}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> Login to Unlock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
