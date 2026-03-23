import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="container py-10">
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-primary-foreground text-center space-y-4">
        <h2 className="font-display font-bold text-2xl">Ready to Unlock Exclusive Offers?</h2>
        <p className="opacity-80 max-w-md mx-auto">Sign up free to scratch, spin, and claim offers from your favorite local shops.</p>
        <div className="flex justify-center gap-3">
          <Link to="/signup"><Button size="lg" variant="secondary" className="active:scale-[0.97]">Sign Up Free</Button></Link>
          <Link to="/owner-signup"><Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97]">I'm a Business Owner</Button></Link>
        </div>
      </div>
    </section>
  );
}
