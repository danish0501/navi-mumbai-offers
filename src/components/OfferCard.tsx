import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { MapPin, Clock, Lock, Ticket, RotateCw, Gift, Bookmark, Store } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useFavorites, useToggleFavorite } from '@/hooks/use-favorites';
import { toast } from 'sonner';

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
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const isFavorited = favorites?.some((f: any) => f.offer_id === offer.id);
  const config = typeConfig[offer.offer_type as keyof typeof typeConfig] || typeConfig.direct;
  const Icon = config.icon;
  const daysLeft = differenceInDays(new Date(offer.end_date), new Date());

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save offers');
      navigate('/login');
      return;
    }

    try {
      const result = await toggleFavorite.mutateAsync({ offerId: offer.id });
      if (result.action === 'added') {
        toast.success('Offer saved to your favorites');
      } else {
        toast.info('Offer removed from favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

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

        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none">
          <Badge className={`${config.className} text-xs px-2 py-0.5 rounded-full pointer-events-auto shadow-sm`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full transition-all duration-300 pointer-events-auto border ${isFavorited
                ? 'bg-white border-primary/20 text-primary scale-110 shadow-md shadow-primary/10'
                : 'bg-white/40 border-white/40 text-primary/70 hover:text-primary hover:bg-white/60 hover:scale-105'
                } active:scale-95`}
              title={isFavorited ? 'Remove from favorites' : 'Save offer'}
            >
              <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-primary' : ''}`} />
            </button>

            {daysLeft <= 3 && daysLeft >= 0 && (
              <Badge variant="destructive" className="text-xs pointer-events-auto shadow-sm">
                <Clock className="w-3 h-3 mr-1" /> {daysLeft === 0 ? 'Last day!' : `${daysLeft}d left`}
              </Badge>
            )}
          </div>
        </div>

        {/* Location - Bottom Right */}
        {offer.shop?.node?.name && (
          <div className="absolute bottom-3 right-3 pointer-events-none group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-primary rounded-lg text-white text-[10px] font-bold border border-white/10 shadow-lg">
              <MapPin className="w-3 h-3 text-white" />
              <span className="tracking-wide uppercase text-[10px]">{offer.shop.node.name}</span>
            </div>
          </div>
        )}

        {/* Lock overlay for guests - subtle darkened version if guest */}
        {!user && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 pointer-events-none">
            <Lock className="w-6 h-6 text-primary-foreground opacity-80" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-base line-clamp-2">{offer.title}</h3>

        {offer.discount_text && (
          <p className="text-primary font-semibold text-base">{offer.discount_text}</p>
        )}

        {offer.shop && (
          <div className="flex items-center justify-between gap-2 py-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary max-[426px]:bg-primary/20 flex items-center justify-center overflow-hidden max-[426px]:border-primary border border-border group-hover:border-primary transition-colors duration-300">
                {offer.shop.logo_url ? (
                  <img src={offer.shop.logo_url} alt={offer.shop.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-3.5 h-3.5 text-muted-foreground max-[426px]:text-primary group-hover:text-primary transition-colors duration-300" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate max-w-[120px] md:max-w-[150px]">
                  {offer.shop.name}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const query = encodeURIComponent(`${offer.shop.name} ${offer.shop.full_address || ''}`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
              }}
              className="p-1.5 rounded-full bg-secondary max-[426px]:bg-primary/20 text-black max-[426px]:text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 active:scale-95"
              title="View on Google Maps"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-destructive border-t border-border pt-2 mt-2">
          <Clock className="w-4 h-4" />
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
