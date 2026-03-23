import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Gift } from 'lucide-react';

interface ShopCardProps {
  shop: any;
}

export function ShopCard({ shop }: ShopCardProps) {
  const activeOffers = shop.offers?.filter((o: any) => o.is_active && o.status === 'approved')?.length || 0;

  return (
    <Link
      to={`/shop/${shop.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
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
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">Verified</Badge>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-base truncate group-hover:text-primary transition-colors">{shop.name}</h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs font-normal">{shop.category?.name}</Badge>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {shop.node?.name}
          </span>
        </div>

        {shop.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{shop.description}</p>
        )}

        {activeOffers > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-primary">
            <Gift className="w-3.5 h-3.5" />
            {activeOffers} active offer{activeOffers > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Link>
  );
}
