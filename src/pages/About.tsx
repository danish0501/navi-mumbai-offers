import { PublicLayout } from '@/components/PublicLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Ticket, Store, UserCheck } from 'lucide-react';

export default function AboutPage() {
  const steps = [
    { icon: Search, title: 'Discover', desc: 'Browse local shops and offers across 18 Navi Mumbai nodes by area or category.' },
    { icon: Ticket, title: 'Unlock', desc: 'Scratch cards, spin wheels, or claim direct coupons. Login to reveal exclusive deals.' },
    { icon: Store, title: 'Redeem', desc: 'Show your claimed offer at the shop. No middleman, direct local deals.' },
  ];

  return (
    <PublicLayout>
      <div className="container py-16 max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-display font-bold text-3xl">How Navi Mumbai Offers Works</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">A hyperlocal platform connecting Navi Mumbai residents with real offers from verified local businesses.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mx-auto">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border p-8 space-y-4">
          <h2 className="font-display font-semibold text-xl flex items-center gap-2"><UserCheck className="w-5 h-5 text-primary" /> For Business Owners</h2>
          <p className="text-sm text-muted-foreground">List your business, choose your area and category, and create scratch card, spin wheel, or direct coupon offers. Reach local customers directly.</p>
          <Link to="/owner-signup"><Button>List Your Business</Button></Link>
        </div>
      </div>
    </PublicLayout>
  );
}
