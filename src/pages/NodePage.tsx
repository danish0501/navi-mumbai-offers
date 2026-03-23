import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsRight, X, Filter } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function NodePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: nodes } = useNodes();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const node = nodes?.find(n => n.slug === slug);
  const activeCategory = categories?.find(c => c.slug === selectedCategory);

  const { data: shops, isLoading: shopsLoading } = useShops({ 
    nodeSlug: slug, 
    categorySlug: selectedCategory || undefined 
  });
  const { data: offers, isLoading: offersLoading } = useOffers({ 
    nodeSlug: slug, 
    categorySlug: selectedCategory || undefined 
  });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // Filter labels and logic
  const pageTitle = activeCategory ? `${activeCategory.name} in ${node?.name || slug}` : (node?.name || slug);

  return (
    <PublicLayout>
      <div className="container py-8 space-y-8 min-h-[60vh]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-bold uppercase tracking-wider">
                Area Hub
              </span>
              {selectedCategory && (
                <Badge variant="outline" className="text-[12px] font-bold text-primary border-primary/20 bg-primary/5 pl-1.5 pr-1 px-3 py-1 gap-1 capitalize">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              )}
            </div>
            <h1 className="font-display font-black text-2xl md:text-4xl text-foreground">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {shops?.length || 0} shops · {offers?.length || 0} active offers
            </p>
          </div>

          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="group flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all border border-primary/20"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Categories Section - Hidden when a category is selected to save space */}
        <AnimatePresence>
          {!selectedCategory && (
            <motion.div 
              initial={{ height: 'auto', opacity: 1 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Filter by Category</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground tracking-wide border border-border">
                  <span>SWIPE</span>
                  <motion.div 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ChevronsRight className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                </div>
              </div>
              
              <div className="flex flex-nowrap gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {categories?.map((c, i) => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`flex-none group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary transition-all duration-300 active:scale-95 whitespace-nowrap ${i === (categories?.length || 0) - 1 ? 'mr-4' : ''}`}
                  >
                    <div className="p-1 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <CategoryIcon name={c.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h2 className="font-display font-bold text-xl text-foreground">Offers in {node?.name || slug}</h2>
          </div>
          {offersLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers?.map((o: any) => <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />)}
            </div>
          )}
          {!offersLoading && (!offers || offers.length === 0) && (
            <div className="p-12 text-center rounded-3xl bg-secondary/30 border border-dashed border-border group">
              <div className="w-16 h-16 bg-background rounded-2xl flex items-center center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Filter className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-sm">No active offers found for this filter.</p>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="mt-4 text-primary text-sm font-bold hover:underline">
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h2 className="font-display font-bold text-xl text-foreground">Shops in {node?.name || slug}</h2>
          </div>
          {shopsLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops?.map((s: any) => <ShopCard key={s.id} shop={s} />)}
            </div>
          )}
          {!shopsLoading && (!shops || shops.length === 0) && (
             <div className="p-8 text-center text-muted-foreground text-sm italic">
               No shops listed for this criteria.
             </div>
          )}
        </div>

        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
