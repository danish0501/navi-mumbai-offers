import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { ShopCard } from '@/components/ShopCard';
import { GridSkeleton } from '@/components/Skeletons';
import { useShops } from '@/hooks/use-shops';
import { useNodes } from '@/hooks/use-nodes';
import { useCategories } from '@/hooks/use-categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ShopsPage() {
  const [nodeSlug, setNodeSlug] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [search, setSearch] = useState('');
  const { data: nodes } = useNodes();
  const { data: categories } = useCategories();
  const { data: shops, isLoading } = useShops({ nodeSlug: nodeSlug || undefined, categorySlug: categorySlug || undefined, search: search || undefined });

  return (
    <PublicLayout>
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Explore Shops</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover verified local businesses across Navi Mumbai</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search shops..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
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
        </div>

        {isLoading ? <GridSkeleton count={6} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops?.map((s: any) => <ShopCard key={s.id} shop={s} />)}
          </div>
        )}

        {!isLoading && (!shops || shops.length === 0) && (
          <div className="text-center py-16 space-y-2">
            <p className="text-lg font-medium">No shops found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
