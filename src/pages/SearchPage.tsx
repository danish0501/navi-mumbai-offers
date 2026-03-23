import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { ShopCard } from '@/components/ShopCard';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { GridSkeleton } from '@/components/Skeletons';
import { useShops } from '@/hooks/use-shops';
import { useOffers } from '@/hooks/use-offers';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const { data: shops, isLoading: sl } = useShops({ search: q || undefined });
  const { data: offers, isLoading: ol } = useOffers({ search: q || undefined });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: query });
  };

  return (
    <PublicLayout>
      <div className="container py-8 space-y-6">
        <form onSubmit={handleSearch} className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search shops, offers..." className="pl-10 h-12 text-base" />
        </form>
        {q && <p className="text-sm text-muted-foreground">Results for "{q}"</p>}
        {q && (
          <>
            <div>
              <h2 className="font-display font-semibold text-lg mb-3">Shops</h2>
              {sl ? <GridSkeleton count={3} /> : shops && shops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shops.map((s: any) => <ShopCard key={s.id} shop={s} />)}
                </div>
              ) : <p className="text-sm text-muted-foreground">No shops found</p>}
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg mb-3">Offers</h2>
              {ol ? <GridSkeleton count={3} /> : offers && offers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map((o: any) => <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />)}
                </div>
              ) : <p className="text-sm text-muted-foreground">No offers found</p>}
            </div>
          </>
        )}
        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
