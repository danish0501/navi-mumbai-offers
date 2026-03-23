import { Link } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
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
  );
}
