import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LayoutDashboard, Store, Bookmark } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, isAdmin, isShopOwner, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { label: 'Explore Offers', href: '/offers' },
    { label: 'Explore Shops', href: '/shops' },
    { label: 'How It Works', href: '/about' },
  ];

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isShopOwner) return '/owner';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">NM</span>
          </div>
          <span className="hidden sm:inline">Navi Mumbai Offers</span>
          <span className="sm:hidden">NMO</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => {
            const isActive = pathname.startsWith(l.href);
            return (
              <Link 
                key={l.href} 
                to={l.href} 
                className={`relative text-base font-medium transition-colors py-1 ${
                  isActive ? 'text-primary' : 'text-black hover:text-primary'
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div 
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-3 space-y-2">
                  <DropdownMenuItem className="cursor-pointer text-base font-semibold" onClick={() => { navigate(getDashboardLink()); setDropdownOpen(false); }}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer text-base font-semibold" onClick={() => { navigate('/owner'); setDropdownOpen(false); }}>
                    <Store className="w-4 h-4 mr-2" />
                    My Shops
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer text-base font-semibold" onClick={() => { navigate('/saved'); setDropdownOpen(false); }}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-base font-semibold" onClick={() => { signOut(); setDropdownOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:inline-flex text-base">
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')} className="text-base">
                Sign Up
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-fade-in-up">
          {navLinks.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <Link to="/login" className="block px-4 py-2 rounded-lg text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>
              Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
