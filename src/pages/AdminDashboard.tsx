import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Check, X, Store, Users, Gift, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);

  const fetchAll = async () => {
    const { data: s } = await supabase.from('shops').select('*, category:categories(*), node:nodes(*)').order('created_at', { ascending: false });
    setShops(s || []);
    const { data: o } = await supabase.from('offers').select('*, shop:shops(name)').order('created_at', { ascending: false });
    setOffers(o || []);
    const { data: p } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(p || []);
    const { data: i } = await supabase.from('offer_interactions').select('*').order('created_at', { ascending: false }).limit(50);
    setInteractions(i || []);
  };

  useEffect(() => { if (!loading && (!user || !isAdmin)) navigate('/login'); }, [user, isAdmin, loading, navigate]);
  useEffect(() => { if (user && isAdmin) fetchAll(); }, [user, isAdmin]);

  const updateShopStatus = async (id: string, status: 'approved' | 'pending' | 'rejected') => {
    const updateData: any = { status };
    if (status === 'approved') updateData.is_verified = true;
    await supabase.from('shops').update(updateData).eq('id', id);
    toast.success(`Shop ${status}`);
    fetchAll();
  };

  const updateOfferStatus = async (id: string, status: 'approved' | 'pending' | 'rejected') => {
    await supabase.from('offers').update({ status }).eq('id', id);
    toast.success(`Offer ${status}`);
    fetchAll();
  };

  if (loading || !user || !isAdmin) return null;

  const pendingShops = shops.filter(s => s.status === 'pending');
  const pendingOffers = offers.filter(o => o.status === 'pending');

  return (
    <PublicLayout>
      <div className="container py-8 space-y-6">
        <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-xl p-4 text-center">
            <Store className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{shops.length}</p>
            <p className="text-xs text-muted-foreground">Total Shops</p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-brand-orange mx-auto mb-1" />
            <p className="text-2xl font-bold">{offers.length}</p>
            <p className="text-xs text-muted-foreground">Total Offers</p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Users</p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <BarChart3 className="w-6 h-6 text-brand-lime mx-auto mb-1" />
            <p className="text-2xl font-bold">{interactions.length}</p>
            <p className="text-xs text-muted-foreground">Interactions</p>
          </div>
        </div>

        {(pendingShops.length > 0 || pendingOffers.length > 0) && (
          <div className="bg-brand-orange-light/30 border border-brand-orange/20 rounded-xl p-4">
            <p className="font-semibold text-sm">⚠️ {pendingShops.length} shops and {pendingOffers.length} offers pending approval</p>
          </div>
        )}

        <Tabs defaultValue="shops">
          <TabsList>
            <TabsTrigger value="shops">Shops ({shops.length})</TabsTrigger>
            <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>

          <TabsContent value="shops" className="space-y-3 mt-4">
            {shops.map(s => (
              <div key={s.id} className="bg-card border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category?.name} · {s.node?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === 'approved' ? 'default' : s.status === 'rejected' ? 'destructive' : 'secondary'}>{s.status}</Badge>
                  {s.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateShopStatus(s.id, 'approved')}><Check className="w-3 h-3 mr-1" /> Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateShopStatus(s.id, 'rejected')}><X className="w-3 h-3 mr-1" /> Reject</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="offers" className="space-y-3 mt-4">
            {offers.map(o => (
              <div key={o.id} className="bg-card border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{o.title}</p>
                  <p className="text-xs text-muted-foreground">{(o.shop as any)?.name} · {o.offer_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={o.status === 'approved' ? 'default' : o.status === 'rejected' ? 'destructive' : 'secondary'}>{o.status}</Badge>
                  {o.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateOfferStatus(o.id, 'approved')}><Check className="w-3 h-3 mr-1" /> Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateOfferStatus(o.id, 'rejected')}><X className="w-3 h-3 mr-1" /> Reject</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="users" className="space-y-3 mt-4">
            {users.map(u => (
              <div key={u.id} className="bg-card border rounded-xl p-4">
                <p className="font-semibold text-sm">{u.full_name}</p>
                <p className="text-xs text-muted-foreground">{u.user_id}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="interactions" className="space-y-3 mt-4">
            {interactions.map(i => (
              <div key={i.id} className="bg-card border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">User: {i.user_id?.slice(0, 8)}... · Offer: {i.offer_id?.slice(0, 8)}...</p>
                  <p className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</p>
                </div>
                <Badge variant="secondary">{i.interaction_type}</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
