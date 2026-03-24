import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Gift, Store, Sparkles, PhoneCall, ArrowRight } from 'lucide-react';

export function CTA() {
  const { user } = useAuth();

  return (
    <section className="container py-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[#1DADA0] to-[#15897D] text-primary-foreground p-6 md:p-8 lg:p-10 shadow-2xl group">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -right-[10%] w-[50%] h-[100%] rounded-full bg-white/10 blur-3xl transform group-hover:scale-110 transition-transform duration-1000 ease-in-out"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[80%] rounded-full bg-black/10 blur-3xl transform group-hover:scale-110 transition-transform duration-1000 ease-in-out"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-5 gap-8 items-center">
          
          <div className="lg:col-span-3 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Navi Mumbai's Premier Offer Platform</span>
            </div>
            
            <h2 className="font-display font-bold text-3xl md:text-4xl max-[426px]:text-4xl leading-tight text-balance tracking-tight">
              Transform Your <span className="text-white underline decoration-white/30 underline-offset-4">Shopping</span> Experience
            </h2>
            
            <p className="text-base md:text-lg text-primary-foreground/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover verified local shops, unlock exclusive scratch cards, and spin the wheel for guaranteed discounts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              {!user ? (
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 font-semibold h-12 px-6 text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.2)] transition-all duration-300 active:scale-[0.98] group/btn"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link to="/offers" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 font-semibold h-12 px-6 text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.2)] transition-all duration-300 active:scale-[0.98] group/btn"
                  >
                    Explore Offers
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <a href="mailto:support@navimumbaioffers.com" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white font-medium h-12 px-6 text-base backdrop-blur-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group/btn2"
                >
                  <PhoneCall className="w-4 h-4 group-hover/btn2:rotate-12 transition-transform" />
                  Contact Us
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 mt-6 lg:mt-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 shadow-lg group/card">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="w-8 h-8 text-white group-hover/card:scale-110 group-hover/card:rotate-12 transition-transform duration-300" />
                <h3 className="text-lg font-semibold text-white">Interactive Offers</h3>
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">
                Win exciting discounts through fun scratch cards and lucky spin wheels.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 shadow-lg group/card lg:translate-x-3">
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8 text-white group-hover/card:scale-110 group-hover/card:-rotate-12 transition-transform duration-300" />
                <h3 className="text-lg font-semibold text-white">Grow Business</h3>
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">
                List your business with us to reach active local customers.
              </p>
              {!user && (
                <Link to="/owner-signup" className="inline-flex items-center mt-2 text-sm font-semibold text-white hover:underline transition-colors group/link">
                  Register Shop 
                  <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
