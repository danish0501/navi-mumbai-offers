import { useState, useMemo } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Filter, ChevronsRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useCategories();
  const { data: nodes } = useNodes();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const category = categories?.find(c => c.slug === slug);
  const activeNode = nodes?.find(n => n.slug === selectedNode);

  const { data: shops, isLoading: shopsLoading } = useShops({ 
    categorySlug: slug,
    nodeSlug: selectedNode || undefined
  });
  const { data: offers, isLoading: offersLoading } = useOffers({ 
    categorySlug: slug,
    nodeSlug: selectedNode || undefined
  });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const pageTitle = activeNode ? `${category?.name || slug} in ${activeNode.name}` : (category?.name || slug);

  return (
    <PublicLayout>
      <div className="container py-8 space-y-8 min-h-[60vh]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {category && (
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CategoryIcon name={category.icon} className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Category
                </span>
                {selectedNode && (
                  <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 pl-1.5 pr-1 py-0.5 gap-1 capitalize">
                    {selectedNode}
                    <button onClick={() => setSelectedNode(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-black text-2xl md:text-4xl text-foreground">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground">{shops?.length || 0} shops · {offers?.length || 0} active offers</p>
            </div>
          </div>

          {selectedNode && (
            <button 
              onClick={() => setSelectedNode(null)}
              className="group flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all border border-primary/20"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Areas Section - Hidden when an area is selected */}
        <AnimatePresence>
          {!selectedNode && (
            <motion.div 
              initial={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4"
            >
               <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Filter by Area</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground tracking-wide border border-border md:hidden">
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
                {nodes?.map((n, i) => (
                  <button 
                    key={n.id} 
                    onClick={() => setSelectedNode(n.slug)}
                    className={`flex-none group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary transition-all duration-300 active:scale-95 whitespace-nowrap ${i === (nodes?.length || 0) - 1 ? 'mr-4' : ''}`}
                  >
                    <div className="p-1 text-muted-foreground group-hover:text-primary transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{n.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h2 className="font-display font-bold text-xl text-foreground">Offers</h2>
          </div>
          {offersLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers?.map((o: any) => <OfferCard key={o.id} offer={o} onInteract={() => setSelectedOffer(o)} />)}
            </div>
          )}
          {!offersLoading && (!offers || offers.length === 0) && (
             <div className="p-12 text-center rounded-3xl bg-secondary/30 border border-dashed border-border">
               <p className="text-muted-foreground text-sm font-medium">No offers in this category & area yet.</p>
               {selectedNode && (
                <button onClick={() => setSelectedNode(null)} className="mt-4 text-primary text-sm font-bold hover:underline">
                  Clear area filter
                </button>
              )}
             </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
           <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-primary rounded-full" />
              <h2 className="font-display font-bold text-xl text-foreground">Shops</h2>
           </div>
          {shopsLoading ? <GridSkeleton count={3} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops?.map((s: any) => <ShopCard key={s.id} shop={s} />)}
            </div>
          )}
          {!shopsLoading && (!shops || shops.length === 0) && (
             <div className="p-8 text-center text-muted-foreground text-sm italic">
               No shops found for this filter.
             </div>
          )}
        </div>

        <OfferModal offer={selectedOffer} open={!!selectedOffer} onOpenChange={o => !o && setSelectedOffer(null)} />
      </div>
    </PublicLayout>
  );
}
