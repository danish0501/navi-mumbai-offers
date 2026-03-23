import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isFormValid = 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Welcome back!');
    navigate('/');
  };

  return (
    <PublicLayout>
      <div className="container max-w-md py-16 max-[426px]:py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-3xl">Welcome Back</h1>
          <p className="text-base text-muted-foreground">Log in to unlock offers and manage your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 bg-card p-6 rounded-2xl border">
          <div className="flex bg-muted p-1 rounded-lg mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'customer' ? 'bg-card shadow-sm text-black' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setRole('customer')}
            >
              Customer
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'owner' ? 'bg-card shadow-sm text-black' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setRole('owner')}
            >
              Business Owner
            </button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="pr-10" required />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!isFormValid || loading}>{loading ? 'Logging in...' : 'Log In'}</Button>
        </form>
        <div className="text-center text-base text-muted-foreground space-y-4 pt-4 border-t">
          <p>Don't have an account?</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="text-primary font-medium text-base hover:underline">Customer Signup</Link>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <Link to="/owner-signup" className="text-primary font-medium hover:underline">Owner Signup</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
