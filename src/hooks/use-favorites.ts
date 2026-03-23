import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';

export function useFavorites() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('*, shop:shops(*, category:categories(*), node:nodes(*)), offer:offers(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId, offerId }: { shopId?: string; offerId?: string }) => {
      if (!user) throw new Error('Not logged in');

      // Check if already favorited
      let query = supabase.from('favorites').select('id').eq('user_id', user.id);
      if (shopId) query = query.eq('shop_id', shopId);
      if (offerId) query = query.eq('offer_id', offerId);

      const { data: existing } = await query;

      if (existing && existing.length > 0) {
        await supabase.from('favorites').delete().eq('id', existing[0].id);
        return { action: 'removed' };
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          shop_id: shopId || null,
          offer_id: offerId || null,
        });
        return { action: 'added' };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
}
