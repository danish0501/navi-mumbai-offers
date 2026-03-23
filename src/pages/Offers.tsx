import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { GridSkeleton } from '@/components/Skeletons';
import { SearchBar } from '@/components/SearchBar';
import { useOffers } from '@/hooks/use-offers';
import { useNodes } from '@/hooks/use-nodes';
import { useCategories } from '@/hooks/use-categories';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OffersPage() {
  const [nodeSlug, setNodeSlug] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [offerType, setOfferType] = useState('');
  const [sort, setSort] = useState<'newest' | 'ending_soon' | 'popular'>('newest');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const { data: nodes } = useNodes();
  const { data: categories } = useCategories();
  const { data: offers, isLoading } = useOffers({
    nodeSlug: nodeSlug || undefined,
    categorySlug: categorySlug || undefined,
    offerType: offerType || undefined,
    sort,
  });

  return (
    <PublicLayout>
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Explore Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse scratch cards, spin wheels, and coupons from local businesses</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={nodeSlug} onValueChange={v => setNodeSlug(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All Areas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {nodes?.map(n => <SelectItem key={n.id} value={n.slug}>{n.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={categorySlug} onValueChange={v => setCategorySlug(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={offerType} onValueChange={v => setOfferType(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="scratch">Scratch Card</SelectItem>
              <SelectItem value="spin">Spin Wheel</SelectItem>
              <SelectItem value="direct">Direct Coupon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={v => setSort(v as any)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(nodeSlug || categorySlug || offerType) && (
          <div className="flex flex-wrap gap-2">
            {nodeSlug && <Badge variant="secondary" className="cursor-pointer" onClick={() => setNodeSlug('')}>Area: {nodes?.find(n => n.slug === nodeSlug)?.name} ✕</Badge>}
            {categorySlug && <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategorySlug('')}>Category: {categories?.find(c => c.slug === categorySlug)?.name} ✕</Badge>}
            {offerType && <Badge variant="secondary" className="cursor-pointer" onClick={() => setOfferType('')}>Type: {offerType} ✕</Badge>}
          </div>
        )}

        {isLoading ? <GridSkeleton count={6} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers?.map((o: any) => <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />)}
          </div>
        )}

        {!isLoading && (!offers || offers.length === 0) && (
          <div className="text-center py-16 space-y-2">
            <p className="text-lg font-medium">No offers found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later</p>
          </div>
        )}

        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
