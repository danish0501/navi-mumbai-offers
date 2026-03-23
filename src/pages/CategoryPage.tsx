import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { ShopCard } from '@/components/ShopCard';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { GridSkeleton } from '@/components/Skeletons';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useShops } from '@/hooks/use-shops';
import { useOffers } from '@/hooks/use-offers';
import { useCategories } from '@/hooks/use-categories';
import { useNodes } from '@/hooks/use-nodes';
import { Badge } from '@/components/ui/badge';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useCategories();
  const { data: nodes } = useNodes();
  const category = categories?.find(c => c.slug === slug);
  const { data: shops, isLoading: shopsLoading } = useShops({ categorySlug: slug });
  const { data: offers, isLoading: offersLoading } = useOffers({ categorySlug: slug });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  return (
    <PublicLayout>
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-3">
          {category && (
            <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center">
              <CategoryIcon name={category.icon} className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl">{category?.name || slug}</h1>
            <p className="text-sm text-muted-foreground">{shops?.length || 0} shops · {offers?.length || 0} active offers</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {nodes?.map(n => (
            <Link key={n.id} to={`/node/${n.slug}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">{n.name}</Badge>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Offers</h2>
          {offersLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers?.map((o: any) => <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />)}
            </div>
          )}
          {!offersLoading && (!offers || offers.length === 0) && <p className="text-muted-foreground text-sm py-4">No offers in this category yet.</p>}
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Shops</h2>
          {shopsLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops?.map((s: any) => <ShopCard key={s.id} shop={s} />)}
            </div>
          )}
        </div>

        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
