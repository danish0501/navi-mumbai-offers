import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOffers } from '@/hooks/use-offers';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { GridSkeleton } from '@/components/Skeletons';

export function FeaturedOffersSection() {
  const { data: offers, isLoading: offersLoading } = useOffers({ featured: false });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  return (
    <section className="container py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Latest Offers</h2>
        <Link to="/offers" className="text-sm text-primary font-medium hover:underline">View all →</Link>
      </div>
      {offersLoading ? <GridSkeleton count={3} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers?.slice(0, 6).map((o: any) => (
            <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />
          ))}
        </div>
      )}
      {!offersLoading && (!offers || offers.length === 0) && (
        <p className="text-center text-muted-foreground py-8">No offers yet. Check back soon!</p>
      )}

      <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={(o) => !o && setSelectedOffer(null)} />
    </section>
  );
}
