import { PublicLayout } from '@/components/PublicLayout';
import { HeroSection } from '@/components/Home/HeroSection';
import { TrustStripSection } from '@/components/Home/TrustStripSection';
import { NodesSection } from '@/components/Home/NodesSection';
import { CategoriesSection } from '@/components/Home/CategoriesSection';
import { OffersSection } from '@/components/Home/OffersSection';
import { ShopsSection } from '@/components/Home/ShopsSection';
import { CTA } from '@/components/CTA';

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <TrustStripSection />
      <NodesSection />
      <CategoriesSection />
      <OffersSection />
      <ShopsSection />
      <CTA />
    </PublicLayout>
  );
}
