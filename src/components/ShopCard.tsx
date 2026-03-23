import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Tag, Gift } from 'lucide-react';

interface ShopCardProps {
  shop: any;
}

export function ShopCard({ shop }: ShopCardProps) {
  const navigate = useNavigate();
  const activeOffers = shop.offers?.filter((o: any) => o.is_active && o.status === 'approved')?.length || 0;

  return (
    <div
      onClick={() => navigate(`/shop/${shop.slug}`)}
      className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
    >
      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
        {shop.cover_url ? (
          <img src={shop.cover_url} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <Tag className="w-8 h-8 text-muted-foreground/40" />
          </div>
        )}
        {shop.is_verified && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs shadow-sm">Verified</Badge>
        )}

        {/* Location - Bottom Right */}
        {shop.node?.name && (
          <div className="absolute bottom-3 right-3 pointer-events-none group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-primary rounded-lg text-white text-[10px] font-bold border border-white/10 shadow-lg">
              <MapPin className="w-3 h-3 text-white" />
              <span className="tracking-wide uppercase text-[10px]">{shop.node.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-display font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">{shop.name}</h3>

        <div className="flex items-center justify-between gap-2 mt-1">
          <Badge variant="secondary" className="text-[12px] font-semibold uppercase tracking-wider bg-secondary/50 max-[426px]:bg-primary/20 text-black max-[426px]:text-primary border-none px-2 py-0.5 rounded-md transition-colors duration-300">
            {shop.category?.name}
          </Badge>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const query = encodeURIComponent(`${shop.name} ${shop.full_address || ''}`);
              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
            }}
            className="p-1.5 rounded-full bg-secondary max-[426px]:bg-primary/20 text-black max-[426px]:text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 active:scale-95"
            title="View on Google Maps"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>

        {shop.description && (
          <p className="text-base text-muted-foreground line-clamp-2">{shop.description}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border mt-2">
          {activeOffers > 0 ? (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Gift className="w-4 h-4" />
              <span>{activeOffers} active offer{activeOffers > 1 ? 's' : ''}</span>
            </div>
          ) : (
            <div />
          )}
          
          <Button size="sm" variant="outline" className="h-8 px-3 text-sm gap-1 text-primary bg-white max-[426px]:bg-primary/20 border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 rounded-full">
            Visit Shop <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
