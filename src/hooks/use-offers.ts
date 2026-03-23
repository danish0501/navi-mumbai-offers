import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OfferFilters {
  nodeSlug?: string;
  categorySlug?: string;
  offerType?: string;
  search?: string;
  featured?: boolean;
  shopId?: string;
  sort?: 'newest' | 'ending_soon' | 'popular';
}

export function useOffers(filters: OfferFilters = {}) {
  return useQuery({
    queryKey: ['offers', filters],
    queryFn: async () => {
      let query = supabase
        .from('offers')
        .select(`
          *,
          shop:shops(*, category:categories(*), node:nodes(*)),
          interactions:offer_interactions(count)
        `)
        .eq('status', 'approved')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString().split('T')[0]);

      if (filters.offerType) {
        query = query.eq('offer_type', filters.offerType as any);
      }

      if (filters.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters.shopId) {
        query = query.eq('shop_id', filters.shopId);
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Base sorting
      if (filters.sort === 'ending_soon') {
        query = query.order('end_date', { ascending: true });
      } else if (filters.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform data and handle client-side sorting/filtering
      let processed = (data || []).map((o: any) => ({
        ...o,
        usage_count: o.interactions?.[0]?.count || 0
      }));

      if (filters.sort === 'popular') {
        processed = processed.sort((a, b) => b.usage_count - a.usage_count);
      }

      if (filters.nodeSlug) {
        processed = processed.filter((o: any) => o.shop?.node?.slug === filters.nodeSlug);
      }
      if (filters.categorySlug) {
        processed = processed.filter((o: any) => o.shop?.category?.slug === filters.categorySlug);
      }

      return processed;
    },
  });
}

export function useOfferInteractions(userId?: string) {
  return useQuery({
    queryKey: ['offer-interactions', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('offer_interactions')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useSpinOutcomes(offerId: string) {
  return useQuery({
    queryKey: ['spin-outcomes', offerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offer_spin_outcomes')
        .select('*')
        .eq('offer_id', offerId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!offerId,
  });
}
