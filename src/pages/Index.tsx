import { PublicLayout } from '@/components/PublicLayout';
import { HeroSection } from '@/components/Home/HeroSection';
import { TrustStripSection } from '@/components/Home/TrustStripSection';
import { NodesSection } from '@/components/Home/NodesSection';
import { CategoriesSection } from '@/components/Home/CategoriesSection';
import { FeaturedOffersSection } from '@/components/Home/FeaturedOffersSection';
import { FeaturedShopsSection } from '@/components/Home/FeaturedShopsSection';
import { CtaSection } from '@/components/Home/CtaSection';

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <TrustStripSection />
      <NodesSection />
      <CategoriesSection />
      <FeaturedOffersSection />
      <FeaturedShopsSection />
      <CtaSection />
    </PublicLayout>
  );
}
