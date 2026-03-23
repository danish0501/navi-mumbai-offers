import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role: 'user' } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Account created! Welcome to Navi Mumbai Offers.');
    navigate('/');
  };

  return (
    <PublicLayout>
      <div className="container max-w-md py-16 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-2xl">Create Account</h1>
          <p className="text-sm text-muted-foreground">Sign up to unlock scratch cards, spin wheels, and local coupons</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4 bg-card p-6 rounded-2xl border">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          {' · '}
          <Link to="/owner-signup" className="text-primary font-medium hover:underline">Business owner?</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
