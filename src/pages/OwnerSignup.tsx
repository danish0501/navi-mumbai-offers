import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function OwnerSignupPage() {
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
      options: { data: { full_name: name, role: 'shop_owner' } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Owner account created! You can now list your business.');
    navigate('/owner');
  };

  return (
    <PublicLayout>
      <div className="container max-w-md py-16 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-2xl">List Your Business</h1>
          <p className="text-sm text-muted-foreground">Create an owner account to list shops and create offers</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4 bg-card p-6 rounded-2xl border">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Owner Account'}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          {' · '}
          <Link to="/signup" className="text-primary font-medium hover:underline">Regular user?</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
