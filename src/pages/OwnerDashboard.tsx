import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { supabase } from '@/integrations/supabase/client';
import { useShops } from '@/hooks/use-shops';
import { useNodes } from '@/hooks/use-nodes';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Store, Gift, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function OwnerDashboard() {
  const { user, isShopOwner, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: nodes } = useNodes();
  const { data: categories } = useCategories();

  // Fetch owner's shops directly (including non-approved)
  const [myShops, setMyShops] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);

  const fetchMyData = async () => {
    if (!user) return;
    const { data: shops } = await supabase.from('shops').select('*, category:categories(*), node:nodes(*)').eq('owner_id', user.id);
    setMyShops(shops || []);
    if (shops && shops.length > 0) {
      const shopIds = shops.map(s => s.id);
      const { data: offers } = await supabase.from('offers').select('*, shop:shops(name)').in('shop_id', shopIds);
      setMyOffers(offers || []);
    }
  };

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);
  useEffect(() => { if (user) fetchMyData(); }, [user]);

  // Shop form state
  const [shopDialog, setShopDialog] = useState(false);
  const [shopForm, setShopForm] = useState({ name: '', category_id: '', node_id: '', description: '', full_address: '', phone: '', whatsapp: '' });

  const createShop = async () => {
    if (!user || !shopForm.name || !shopForm.category_id || !shopForm.node_id) { toast.error('Fill required fields'); return; }
    const slug = shopForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    const { error } = await supabase.from('shops').insert({
      owner_id: user.id, name: shopForm.name, slug, category_id: shopForm.category_id, node_id: shopForm.node_id,
      description: shopForm.description, full_address: shopForm.full_address, phone: shopForm.phone, whatsapp: shopForm.whatsapp,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Shop submitted for approval!');
    setShopDialog(false);
    setShopForm({ name: '', category_id: '', node_id: '', description: '', full_address: '', phone: '', whatsapp: '' });
    fetchMyData();
  };

  // Offer form
  const [offerDialog, setOfferDialog] = useState(false);
  const [offerForm, setOfferForm] = useState({ shop_id: '', title: '', offer_type: 'direct' as string, discount_text: '', coupon_code: '', description: '', terms: '' });

  const createOffer = async () => {
    if (!offerForm.shop_id || !offerForm.title) { toast.error('Fill required fields'); return; }
    const { error } = await supabase.from('offers').insert({
      shop_id: offerForm.shop_id, title: offerForm.title, offer_type: offerForm.offer_type as any,
      discount_text: offerForm.discount_text, coupon_code: offerForm.coupon_code,
      description: offerForm.description, terms: offerForm.terms,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Offer created!');
    setOfferDialog(false);
    setOfferForm({ shop_id: '', title: '', offer_type: 'direct', discount_text: '', coupon_code: '', description: '', terms: '' });
    fetchMyData();
  };

  if (loading || !user) return null;

  return (
    <PublicLayout>
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Owner Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={shopDialog} onOpenChange={setShopDialog}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Shop</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Shop</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Shop Name *</Label><Input value={shopForm.name} onChange={e => setShopForm(p => ({...p, name: e.target.value}))} /></div>
                  <div><Label>Category *</Label>
                    <Select value={shopForm.category_id} onValueChange={v => setShopForm(p => ({...p, category_id: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Area *</Label>
                    <Select value={shopForm.node_id} onValueChange={v => setShopForm(p => ({...p, node_id: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{nodes?.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Description</Label><Textarea value={shopForm.description} onChange={e => setShopForm(p => ({...p, description: e.target.value}))} /></div>
                  <div><Label>Address</Label><Input value={shopForm.full_address} onChange={e => setShopForm(p => ({...p, full_address: e.target.value}))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Phone</Label><Input value={shopForm.phone} onChange={e => setShopForm(p => ({...p, phone: e.target.value}))} /></div>
                    <div><Label>WhatsApp</Label><Input value={shopForm.whatsapp} onChange={e => setShopForm(p => ({...p, whatsapp: e.target.value}))} /></div>
                  </div>
                  <Button onClick={createShop} className="w-full">Submit for Approval</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={offerDialog} onOpenChange={setOfferDialog}>
              <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add Offer</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Offer</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Shop *</Label>
                    <Select value={offerForm.shop_id} onValueChange={v => setOfferForm(p => ({...p, shop_id: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select shop" /></SelectTrigger>
                      <SelectContent>{myShops.filter(s => s.status === 'approved').map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Title *</Label><Input value={offerForm.title} onChange={e => setOfferForm(p => ({...p, title: e.target.value}))} /></div>
                  <div><Label>Offer Type *</Label>
                    <Select value={offerForm.offer_type} onValueChange={v => setOfferForm(p => ({...p, offer_type: v}))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scratch">Scratch Card</SelectItem>
                        <SelectItem value="spin">Spin Wheel</SelectItem>
                        <SelectItem value="direct">Direct Coupon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Discount Text</Label><Input value={offerForm.discount_text} onChange={e => setOfferForm(p => ({...p, discount_text: e.target.value}))} /></div>
                  <div><Label>Coupon Code</Label><Input value={offerForm.coupon_code} onChange={e => setOfferForm(p => ({...p, coupon_code: e.target.value}))} /></div>
                  <div><Label>Description</Label><Textarea value={offerForm.description} onChange={e => setOfferForm(p => ({...p, description: e.target.value}))} /></div>
                  <Button onClick={createOffer} className="w-full">Create Offer</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-xl p-4 text-center">
            <Store className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{myShops.length}</p>
            <p className="text-xs text-muted-foreground">My Shops</p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-brand-orange mx-auto mb-1" />
            <p className="text-2xl font-bold">{myOffers.length}</p>
            <p className="text-xs text-muted-foreground">My Offers</p>
          </div>
        </div>

        <Tabs defaultValue="shops">
          <TabsList>
            <TabsTrigger value="shops">My Shops</TabsTrigger>
            <TabsTrigger value="offers">My Offers</TabsTrigger>
          </TabsList>
          <TabsContent value="shops" className="space-y-3 mt-4">
            {myShops.length === 0 ? <p className="text-sm text-muted-foreground py-4">No shops yet. Add your first shop!</p> :
              myShops.map(s => (
                <div key={s.id} className="bg-card border rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.category?.name} · {s.node?.name}</p>
                  </div>
                  <Badge variant={s.status === 'approved' ? 'default' : s.status === 'rejected' ? 'destructive' : 'secondary'}>{s.status}</Badge>
                </div>
              ))
            }
          </TabsContent>
          <TabsContent value="offers" className="space-y-3 mt-4">
            {myOffers.length === 0 ? <p className="text-sm text-muted-foreground py-4">No offers yet.</p> :
              myOffers.map(o => (
                <div key={o.id} className="bg-card border rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{(o.shop as any)?.name} · {o.offer_type}</p>
                  </div>
                  <Badge variant={o.status === 'approved' ? 'default' : o.status === 'rejected' ? 'destructive' : 'secondary'}>{o.status}</Badge>
                </div>
              ))
            }
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
