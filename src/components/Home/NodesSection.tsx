import { Link } from 'react-router-dom';
import { useNodes } from '@/hooks/use-nodes';
import { MapPin, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function NodesSection() {
  const { data: nodes, isLoading: nodesLoading } = useNodes();

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
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs max-[426px]:text-xs font-bold uppercase tracking-wider mb-0.5 md:mb-1">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-primary"></span>
            </span>
            Local Hubs
          </div>
          <h2 className="font-display font-black text-xl md:text-3xl max-[426px]:text-2xl text-foreground flex items-center gap-2 leading-tight">
            Explore Your <span className="text-primary whitespace-nowrap">Locality</span>
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
          className="flex flex-nowrap md:flex-wrap gap-3 overflow-x-auto pb-4 md:pb-0 scroll-smooth no-scrollbar"
        >
          {nodesLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-none h-10 w-28 rounded-xl bg-muted animate-pulse" />
            ))
          ) : (
            nodes?.map((n, i) => (
              <motion.div key={n.id} variants={item} className="flex-none">
                <Link 
                  to={`/node/${n.slug}`} 
                  className={`group relative flex items-center gap-1.5 max-[426px]:gap-0 px-3.5 py-2 md:px-4 md:py-2 max-[426px]:px-6 max-[426px]:py-2 rounded-xl border border-border bg-card hover:border-primary transition-all duration-300 active:scale-95 whitespace-nowrap ${i === (nodes?.length || 0) - 1 ? 'mr-4 md:mr-0' : ''}`}
                >
                  <div className="p-1 text-foreground group-hover:text-primary transition-colors">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 max-[426px]:w-4 max-[426px]:h-4" />
                  </div>
                  <span className="text-xs md:text-sm max-[426px]:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {n.name}
                  </span>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -z-10" />
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
