import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { GridSkeleton } from '@/components/Skeletons';
import { useShopBySlug } from '@/hooks/use-shops';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: shop, isLoading } = useShopBySlug(slug || '');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  if (isLoading) return <PublicLayout><div className="container py-8"><GridSkeleton count={1} /></div></PublicLayout>;
  if (!shop) return <PublicLayout><div className="container py-16 text-center"><p className="text-lg">Shop not found</p></div></PublicLayout>;

  const activeOffers = shop.offers?.filter((o: any) => o.is_active && o.status === 'approved') || [];

  return (
    <PublicLayout>
      {/* Cover */}
      <div className="aspect-[3/1] bg-muted relative overflow-hidden max-h-64">
        {shop.cover_url ? (
          <img src={shop.cover_url} alt={shop.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
        )}
      </div>

      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              {shop.logo_url && (
                <img src={shop.logo_url} alt="" className="w-16 h-16 rounded-xl object-cover border" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-2xl">{shop.name}</h1>
                  {shop.is_verified && <Badge className="bg-primary text-primary-foreground">Verified</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <Badge variant="secondary">{shop.category?.name}</Badge>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {shop.node?.name}</span>
                </div>
              </div>
            </div>

            {shop.description && <p className="text-sm text-muted-foreground leading-relaxed">{shop.description}</p>}

            <div className="space-y-2 text-sm">
              {shop.full_address && <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" /> {shop.full_address}</p>}
              {shop.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {shop.phone}</p>}
              {shop.website && <a href={shop.website} target="_blank" rel="noopener" className="flex items-center gap-2 text-primary hover:underline"><Globe className="w-4 h-4" /> Website <ExternalLink className="w-3 h-3" /></a>}
            </div>

            <div className="flex flex-wrap gap-2">
              {shop.whatsapp && (
                <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener">
                  <Button variant="outline" size="sm">WhatsApp</Button>
                </a>
              )}
              {shop.phone && (
                <a href={`tel:${shop.phone}`}><Button variant="outline" size="sm">Call</Button></a>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {shop.shop_images && shop.shop_images.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-lg mb-3">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shop.shop_images.map((img: any) => (
                <img key={img.id} src={img.image_url} alt="" className="rounded-xl aspect-square object-cover" />
              ))}
            </div>
          </div>
        )}

        {/* Offers */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-3">Available Offers ({activeOffers.length})</h2>
          {activeOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOffers.map((o: any) => (
                <OfferCard key={o.id} offer={{ ...o, shop }} onInteract={() => setSelectedOffer({ ...o, shop })} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-4">No active offers right now.</p>
          )}
        </div>

        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
