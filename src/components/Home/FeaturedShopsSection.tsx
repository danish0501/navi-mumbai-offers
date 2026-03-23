import { Link } from 'react-router-dom';
import { useShops } from '@/hooks/use-shops';
import { ShopCard } from '@/components/ShopCard';
import { GridSkeleton } from '@/components/Skeletons';

export function FeaturedShopsSection() {
  const { data: shops, isLoading: shopsLoading } = useShops({ featured: false });

  return (
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
  );
}
