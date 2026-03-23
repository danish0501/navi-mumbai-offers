import { Link } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Store, Users, ShieldCheck, Banknote } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Component for a 3D Tilt Card
function TiltCard({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      style={{ perspective: 1000 }}
      className={`relative z-10 w-full ${className}`}
    >
      <motion.div
        className="w-full h-full"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center text-white bg-[#030712]">
      {/* Clean, professional dark background with subtle glowing animated meshes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[100] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] opacity-100"></div>

        {/* Glowing orbs with more dynamic feel synced to brand colors */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[50rem] h-[50rem] bg-[hsl(var(--primary))/15] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-20 w-[40rem] h-[40rem] bg-[hsl(var(--primary))/10] rounded-full blur-[100px]"
        />
      </div>

      <div className="container relative z-10 py-12">
        <div className="grid lg:grid-cols-12 gap-6 items-center">

          {/* Left Content */}
          <div className="lg:col-span-6 space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <Badge className="bg-white/5 text-teal-300 transition-colors border border-white/10 text-xs px-4 py-2 rounded-full font-medium backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse text-teal-400" />
                Live across 18 Navi Mumbai nodes
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl max-[426px]:text-[32px] max-[376px]:text-[29px] max-[321px]:text-[24px] leading-[1.1] tracking-tight drop-shadow-2xl"
            >
              Discover Real Local <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] via-emerald-300 to-[hsl(var(--primary))] bg-[size:200%_auto] animate-gradient-x">
                Offers Across Navi Mumbai
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl max-[426px]:text-[19px] max-[376px]:text-[18px] max-[321px]:text-[16px] text-muted font-light mx-auto lg:mx-0 leading-relaxed max-[426px]:leading-normal"
            >
              Scratch cards, <span className="text-[hsl(var(--primary))] font-medium">Spin Wheels</span>, and exclusive coupons right from your verified neighborhood businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-md w-full mx-auto lg:mx-0 relative z-20"
            >
              <div className="p-1.5 bg-[#0a101d]/60 backdrop-blur-xl rounded-[1.25rem] border border-white/10 focus-within:border-[hsl(var(--primary))] transition-all duration-300">
                <SearchBar className="bg-transparent border-0 text-foreground w-full [&>input]:bg-white/5 [&>input]:text-white [&>input]:border-0 [&>input]:h-12 placeholder:text-muted transition-all" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap max-[426px]:flex-col items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link to="/offers" className="max-[426px]:w-full">
                <Button size="lg" className="max-[426px]:w-full h-14 px-12 text-lg font-medium shadow-[0_0_20px_rgba(29,173,160,0.3)] transition-all bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--teal))] hover:opacity-90 text-white rounded-xl active:scale-95 group border-0">
                  Explore Offers
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/owner-signup" className="max-[426px]:w-full">
                <Button size="lg" variant="outline" className="max-[426px]:w-full h-14 px-8 text-lg font-medium border-[hsl(var(--primary))/20] text-white hover:bg-[hsl(var(--primary))/10] hover:border-[hsl(var(--primary))] hover:text-primary rounded-xl active:scale-95 backdrop-blur-sm transition-all group bg-[#0a101d]/50">
                  <Store className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform text-[hsl(var(--primary))]" />
                  List Your Business
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 h-full flex flex-col justify-center mt-12 lg:mt-0 relative group">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-full blur-[100px] -z-10 group-hover:opacity-100 transition-opacity duration-700 opacity-50"></div>

            <div className="flex flex-col gap-6 relative z-10 perspective-[1200px] w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
              {/* 3D Card 1 */}
              <TiltCard delay={0.2} className="lg:translate-x-4">
                <div className="flex items-center gap-5 p-6 bg-gradient-to-br from-[#111827]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all group-hover:border-[hsl(var(--primary))/30]">
                  <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] flex items-center justify-center border border-[hsl(var(--primary))/30] flex-shrink-0 shadow-[inset_0_0_20px_rgba(29,173,160,0.1)]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">10,000+ Users</h3>
                    <p className="text-slate-400 text-sm leading-snug font-light">Join thousands of locals saving money daily efficiently.</p>
                  </div>
                </div>
              </TiltCard>

              {/* 3D Card 2 */}
              <TiltCard delay={0.4} className="lg:-translate-x-4">
                <div className="flex items-center gap-5 p-6 bg-gradient-to-br from-[#111827]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all group-hover:border-[hsl(var(--primary))/30]">
                  <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] flex items-center justify-center border border-[hsl(var(--primary))/30] flex-shrink-0 shadow-[inset_0_0_20px_rgba(29,173,160,0.1)]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">500+ Verified Stores</h3>
                    <p className="text-slate-400 text-sm leading-snug font-light">From cafes to retail, only trusted local businesses.</p>
                  </div>
                </div>
              </TiltCard>

              {/* 3D Card 3 */}
              <TiltCard delay={0.6} className="lg:translate-x-8">
                <div className="flex items-center gap-5 p-6 bg-gradient-to-br from-[#111827]/90 to-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all group-hover:border-blue-400/30">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30 flex-shrink-0 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">100% Free Access</h3>
                    <p className="text-slate-400 text-sm leading-snug font-light">No hidden fees, no credit card required to claim offers.</p>
                  </div>
                </div>
              </TiltCard>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
