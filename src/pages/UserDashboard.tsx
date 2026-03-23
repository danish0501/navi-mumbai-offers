import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { useOfferInteractions } from '@/hooks/use-offers';
import { useFavorites } from '@/hooks/use-favorites';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Heart, Clock } from 'lucide-react';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: interactions } = useOfferInteractions(user?.id);
  const { data: favorites } = useFavorites();

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);

  if (loading || !user) return null;

  const claims = interactions?.filter(i => i.interaction_type === 'claim') || [];

  return (
    <PublicLayout>
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{claims.length}</p>
            <p className="text-xs text-muted-foreground">Claimed Offers</p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold">{favorites?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{interactions?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Interactions</p>
          </div>
        </div>

        <Tabs defaultValue="claims">
          <TabsList>
            <TabsTrigger value="claims">Claimed Offers</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="history">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="claims" className="space-y-3 mt-4">
            {claims.length === 0 ? <p className="text-sm text-muted-foreground py-4">No claimed offers yet. Start exploring!</p> :
              claims.map(c => (
                <div key={c.id} className="bg-card border rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Offer claimed</p>
                    <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">{c.interaction_type}</Badge>
                </div>
              ))
            }
          </TabsContent>
          <TabsContent value="favorites" className="space-y-3 mt-4">
            {(!favorites || favorites.length === 0) ? <p className="text-sm text-muted-foreground py-4">No favorites yet.</p> :
              favorites.map((f: any) => (
                <div key={f.id} className="bg-card border rounded-xl p-4">
                  <p className="font-medium text-sm">{f.shop?.name || f.offer?.title || 'Item'}</p>
                </div>
              ))
            }
          </TabsContent>
          <TabsContent value="history" className="space-y-3 mt-4">
            {(!interactions || interactions.length === 0) ? <p className="text-sm text-muted-foreground py-4">No activity yet.</p> :
              interactions.map(i => (
                <div key={i.id} className="bg-card border rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">{i.interaction_type}</Badge>
                </div>
              ))
            }
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
