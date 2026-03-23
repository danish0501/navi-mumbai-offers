import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/use-categories';
import { CategoryIcon } from '@/components/CategoryIcon';
import { motion } from 'framer-motion';
import { ChevronsRight } from 'lucide-react';

export function CategoriesSection() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  const swipeBadge = {
    animate: {
      x: [0, 8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  return (
    <section className="container py-8 md:py-12 space-y-4 md:space-y-6 overflow-hidden">
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 md:mb-1">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-primary"></span>
            </span>
            Top Choices
          </div>
          <h2 className="font-display font-black text-xl md:text-3xl max-[426px]:text-2xl text-foreground flex items-center gap-2 leading-tight">
            Browse by <span className="text-primary whitespace-nowrap">Category</span>
          </h2>
        </div>

        {/* Swipe Indicator for Mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground tracking-wide border border-border"
        >
          <span>SWIPE</span>
          <motion.div variants={swipeBadge} animate="animate">
            <ChevronsRight className="w-3.5 h-3.5 text-primary" />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-nowrap md:grid md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 scroll-smooth no-scrollbar"
        >
          {categoriesLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-none md:flex-initial h-24 w-24 max-[426px]:h-[72px] max-[426px]:min-w-[140px] md:w-auto rounded-xl bg-muted animate-pulse" />
            ))
          ) : (
            categories?.map((c, i) => (
              <motion.div key={c.id} variants={item} className="flex-none md:flex-initial">
                <Link 
                  to={`/category/${c.slug}`} 
                  className={`flex flex-col max-[426px]:flex-row items-center gap-2.5 p-4 max-[426px]:p-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all active:scale-[0.97] group min-w-[100px] max-[426px]:min-w-[140px] md:min-w-0 ${i === (categories?.length || 0) - 1 ? 'mr-4 md:mr-0' : ''}`}
                >
                  <div className="flex items-center justify-center transition-all duration-300 max-[426px]:w-auto max-[426px]:h-auto max-[426px]:bg-transparent max-[426px]:rounded-none w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground">
                    <CategoryIcon name={c.icon} className="w-5 h-5 md:w-6 md:h-6 max-[426px]:w-4 max-[426px]:h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-xs md:text-sm max-[426px]:text-sm font-bold text-center max-[426px]:text-left leading-tight text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Subtle fade effect for mobile scroll hint */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>
    </section>
  );
}
