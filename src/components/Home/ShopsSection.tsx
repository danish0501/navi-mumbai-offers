import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShops } from '@/hooks/use-shops';
import { ShopCard } from '@/components/ShopCard';
import { GridSkeleton } from '@/components/Skeletons';
import { ArrowRight, Tag } from 'lucide-react';

export function ShopsSection() {
  const { data: shops, isLoading: shopsLoading } = useShops({ featured: false });

    const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

    const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
   <section className="container py-12 space-y-10 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-4 group">
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/20">
              <Tag className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase bg-primary/5 px-3 py-1 rounded-full">
              Verified Partners
            </span>
          </motion.div>

          <div className="space-y-2">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl max-[426px]:text-[34px] font-display font-bold tracking-tight text-foreground leading-[1.1]">
              Explore Local <span className="relative inline-block">
                <span className="text-primary italic">Marketplace</span>
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-primary/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </motion.h2>
          </div>
        </div>

        <motion.div variants={itemVariants} className="hidden min-[427px]:block">
          <Link
            to="/shops"
            className="group/btn relative px-6 py-3 bg-white border border-border rounded-full inline-flex items-center gap-2 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/25"
          >
            <span>Explore All Shops</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </motion.div>
      {shopsLoading ? <GridSkeleton count={3} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops?.slice(0, 6).map((s: any) => <ShopCard key={s.id} shop={s} />)}
        </div>
      )}

      {/* Mobile view button: visible only on <= 426px */}
      {!shopsLoading && shops && shops.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex min-[427px]:hidden justify-center pt-2"
        >
          <Link 
            to="/shops" 
            className="group/btn relative w-full py-4 bg-primary text-white border border-primary rounded-xl flex items-center justify-center gap-2 font-bold active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20"
          >
            <span>Explore All Shops</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
