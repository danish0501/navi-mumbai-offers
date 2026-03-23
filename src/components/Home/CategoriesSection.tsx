import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/use-categories';
import { CategoryIcon } from '@/components/CategoryIcon';

export function CategoriesSection() {
  const { data: categories } = useCategories();

  return (
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
  );
}
