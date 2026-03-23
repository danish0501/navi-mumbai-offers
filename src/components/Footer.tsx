import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">NM</span>
              </div>
              Navi Mumbai Offers
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Discover real local offers from verified businesses across all 18 nodes of Navi Mumbai.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 opacity-80">Explore</h4>
            <div className="space-y-2">
              <Link to="/offers" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Offers</Link>
              <Link to="/shops" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Shops</Link>
              <Link to="/about" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">How It Works</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 opacity-80">For Business</h4>
            <div className="space-y-2">
              <Link to="/owner-signup" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">List Your Business</Link>
              <Link to="/login" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Owner Login</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 opacity-80">Platform</h4>
            <div className="space-y-2">
              <Link to="/demo-info" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Demo Info</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs opacity-40">
          © {new Date().getFullYear()} Navi Mumbai Offers. Built for the local community.
        </div>
      </div>
    </footer>
  );
}
