import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { ShopCard } from '@/components/ShopCard';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { GridSkeleton } from '@/components/Skeletons';
import { useShops } from '@/hooks/use-shops';
import { useOffers } from '@/hooks/use-offers';
import { useNodes } from '@/hooks/use-nodes';
import { useCategories } from '@/hooks/use-categories';
import { Badge } from '@/components/ui/badge';

export default function NodePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: nodes } = useNodes();
  const { data: categories } = useCategories();
  const node = nodes?.find(n => n.slug === slug);
  const { data: shops, isLoading: shopsLoading } = useShops({ nodeSlug: slug });
  const { data: offers, isLoading: offersLoading } = useOffers({ nodeSlug: slug });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  return (
    <PublicLayout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">{node?.name || slug}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {shops?.length || 0} shops · {offers?.length || 0} active offers
          </p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories?.map(c => (
            <Link key={c.id} to={`/category/${c.slug}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">{c.name}</Badge>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Offers in {node?.name}</h2>
          {offersLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers?.map((o: any) => <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />)}
            </div>
          )}
          {!offersLoading && (!offers || offers.length === 0) && <p className="text-muted-foreground text-sm py-4">No active offers in this area yet.</p>}
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Shops in {node?.name}</h2>
          {shopsLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops?.map((s: any) => <ShopCard key={s.id} shop={s} />)}
            </div>
          )}
          {!shopsLoading && (!shops || shops.length === 0) && <p className="text-muted-foreground text-sm py-4">No shops listed in this area yet.</p>}
        </div>

        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
