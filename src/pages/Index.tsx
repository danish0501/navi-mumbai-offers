import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { SearchBar } from '@/components/SearchBar';
import { ShopCard } from '@/components/ShopCard';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { CategoryIcon } from '@/components/CategoryIcon';
import { GridSkeleton } from '@/components/Skeletons';
import { useNodes } from '@/hooks/use-nodes';
import { useCategories } from '@/hooks/use-categories';
import { useShops } from '@/hooks/use-shops';
import { useOffers } from '@/hooks/use-offers';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, MapPin, Zap } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { data: nodes, isLoading: nodesLoading } = useNodes();
  const { data: categories } = useCategories();
  const { data: shops, isLoading: shopsLoading } = useShops({ featured: false });
  const { data: offers, isLoading: offersLoading } = useOffers({ featured: false });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground to-foreground/90 text-primary-foreground">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(174, 72%, 40%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(270, 30%, 55%) 0%, transparent 50%)' }} />
        <div className="container relative py-16 md:py-24 space-y-6">
          <Badge className="bg-primary/20 text-primary border-0 text-xs">🎉 Live across 18 Navi Mumbai nodes</Badge>
          <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight max-w-2xl" style={{ lineHeight: '1.1' }}>
            Discover Real Local Offers Across Navi Mumbai
          </h1>
          <p className="text-base md:text-lg opacity-70 max-w-lg">
            Scratch cards, spin wheels, and exclusive coupons from verified local businesses near you.
          </p>
          <SearchBar className="max-w-md" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/offers"><Button size="lg" className="active:scale-[0.97]">Explore Offers <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            <Link to="/owner-signup"><Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97]">List Your Business</Button></Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b bg-card">
        <div className="container py-4 flex flex-wrap justify-center gap-6 md:gap-12 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Verified Local Businesses</span>
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 18 Navi Mumbai Nodes</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Direct Offers, No Middleman</span>
        </div>
      </section>

      {/* Nodes */}
      <section className="container py-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl">Browse by Area</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {nodesLoading ? Array.from({length:18}).map((_,i) => <div key={i} className="h-9 w-24 rounded-full bg-muted animate-pulse" />) :
            nodes?.map(n => (
              <Link key={n.id} to={`/node/${n.slug}`} className="node-chip">{n.name}</Link>
            ))
          }
        </div>
      </section>

      {/* Categories */}
      <section className="container py-10 space-y-4">
        <h2 className="font-display font-bold text-xl">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories?.map(c => (
            <Link key={c.id} to={`/category/${c.slug}`} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all active:scale-[0.97]">
              <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center">
                <CategoryIcon name={c.icon} className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-center leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Offers */}
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
      </section>

      {/* Featured Shops */}
      <section className="container py-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl">Local Shops</h2>
          <Link to="/shops" className="text-sm text-primary font-medium hover:underline">View all →</Link>
        </div>
        {shopsLoading ? <GridSkeleton count={3} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops?.slice(0, 6).map((s: any) => <ShopCard key={s.id} shop={s} />)}
          </div>
        )}
      </section>

      {/* CTA for guests */}
      {!user && (
        <section className="container py-10">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-primary-foreground text-center space-y-4">
            <h2 className="font-display font-bold text-2xl">Ready to Unlock Exclusive Offers?</h2>
            <p className="opacity-80 max-w-md mx-auto">Sign up free to scratch, spin, and claim offers from your favorite local shops.</p>
            <div className="flex justify-center gap-3">
              <Link to="/signup"><Button size="lg" variant="secondary" className="active:scale-[0.97]">Sign Up Free</Button></Link>
              <Link to="/owner-signup"><Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97]">I'm a Business Owner</Button></Link>
            </div>
          </div>
        </section>
      )}

      <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={(o) => !o && setSelectedOffer(null)} />
    </PublicLayout>
  );
}
