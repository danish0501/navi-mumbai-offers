import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ShopFilters {
  nodeSlug?: string;
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  ownerId?: string;
}

export function useShops(filters: ShopFilters = {}) {
  return useQuery({
    queryKey: ['shops', filters],
    queryFn: async () => {
      let query = supabase
        .from('shops')
        .select(`
          *,
          category:categories(*),
          node:nodes(*),
          offers(id, is_active, status)
        `)
        .eq('status', 'approved');

      if (filters.nodeSlug) {
        const { data: node } = await supabase.from('nodes').select('id').eq('slug', filters.nodeSlug).single();
        if (node) query = query.eq('node_id', node.id);
      }

      if (filters.categorySlug) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.categorySlug).single();
        if (cat) query = query.eq('category_id', cat.id);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useShopBySlug(slug: string) {
  return useQuery({
    queryKey: ['shop', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          category:categories(*),
          node:nodes(*),
          offers(*),
          shop_images(*)
        `)
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
