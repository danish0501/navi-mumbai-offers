import { Shield, MapPin, Zap } from 'lucide-react';

export function TrustStripSection() {
  return (
    <section className="border-b bg-card">
      <div className="container py-4 flex flex-wrap justify-center gap-6 md:gap-12 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Verified Local Businesses</span>
        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 18 Navi Mumbai Nodes</span>
        <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Direct Offers, No Middleman</span>
      </div>
    </section>
  );
}
