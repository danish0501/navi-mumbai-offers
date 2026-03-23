
-- ============================================
-- NAVI MUMBAI OFFERS - Complete Database Schema
-- ============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'shop_owner', 'user');
CREATE TYPE public.shop_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.offer_type AS ENUM ('scratch', 'spin', 'direct');
CREATE TYPE public.offer_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.interaction_type AS ENUM ('scratch', 'spin', 'reveal', 'unlock', 'claim');

-- 2. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. NODES (Navi Mumbai areas)
CREATE TABLE public.nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;

-- 5. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 6. SHOPS
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  node_id UUID NOT NULL REFERENCES public.nodes(id),
  description TEXT,
  full_address TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  instagram TEXT,
  logo_url TEXT,
  cover_url TEXT,
  opening_hours JSONB DEFAULT '{}',
  status shop_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- 7. SHOP IMAGES
CREATE TABLE public.shop_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shop_images ENABLE ROW LEVEL SECURITY;

-- 8. OFFERS
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  offer_type offer_type NOT NULL,
  description TEXT,
  discount_text TEXT,
  coupon_code TEXT,
  redemption_instructions TEXT,
  banner_url TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  total_claim_limit INT,
  per_user_claim_limit INT NOT NULL DEFAULT 1,
  terms TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  allow_repeat BOOLEAN NOT NULL DEFAULT false,
  status offer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- 9. OFFER SPIN OUTCOMES
CREATE TABLE public.offer_spin_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT,
  probability NUMERIC(5,4) NOT NULL DEFAULT 0.2,
  is_winning BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offer_spin_outcomes ENABLE ROW LEVEL SECURITY;

-- 10. OFFER INTERACTIONS
CREATE TABLE public.offer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  interaction_type interaction_type NOT NULL,
  result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offer_interactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_interactions_user_offer ON public.offer_interactions(user_id, offer_id);
CREATE INDEX idx_interactions_offer ON public.offer_interactions(offer_id);

-- 11. FAVORITES
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fav_has_target CHECK (shop_id IS NOT NULL OR offer_id IS NOT NULL)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- 12. ANALYTICS EVENTS
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_shop_owner(_user_id UUID, _shop_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.shops
    WHERE id = _shop_id AND owner_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'user'
  ));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Nodes are viewable by everyone" ON public.nodes FOR SELECT USING (true);
CREATE POLICY "Admins can manage nodes" ON public.nodes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Approved shops are viewable by everyone" ON public.shops FOR SELECT USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shop owners can create shops" ON public.shops FOR INSERT WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'shop_owner'));
CREATE POLICY "Shop owners can update own shops" ON public.shops FOR UPDATE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete shops" ON public.shops FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Shop images viewable by everyone" ON public.shop_images FOR SELECT USING (true);
CREATE POLICY "Shop owners can manage images" ON public.shop_images FOR INSERT WITH CHECK (public.is_shop_owner(auth.uid(), shop_id));
CREATE POLICY "Shop owners can update images" ON public.shop_images FOR UPDATE USING (public.is_shop_owner(auth.uid(), shop_id));
CREATE POLICY "Shop owners can delete images" ON public.shop_images FOR DELETE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Offers viewable by everyone" ON public.offers FOR SELECT USING (
  (status = 'approved' AND is_active = true) 
  OR public.is_shop_owner(auth.uid(), shop_id) 
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Shop owners can create offers" ON public.offers FOR INSERT WITH CHECK (public.is_shop_owner(auth.uid(), shop_id));
CREATE POLICY "Shop owners can update own offers" ON public.offers FOR UPDATE USING (public.is_shop_owner(auth.uid(), shop_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete offers" ON public.offers FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Spin outcomes viewable by everyone" ON public.offer_spin_outcomes FOR SELECT USING (true);
CREATE POLICY "Shop owners can manage spin outcomes" ON public.offer_spin_outcomes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.offers o JOIN public.shops s ON o.shop_id = s.id WHERE o.id = offer_id AND s.owner_id = auth.uid())
);
CREATE POLICY "Shop owners can update spin outcomes" ON public.offer_spin_outcomes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.offers o JOIN public.shops s ON o.shop_id = s.id WHERE o.id = offer_id AND s.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can delete spin outcomes" ON public.offer_spin_outcomes FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own interactions" ON public.offer_interactions FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create interactions" ON public.offer_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view analytics" ON public.analytics_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA: NODES
-- ============================================
INSERT INTO public.nodes (name, slug, sort_order) VALUES
  ('Airoli', 'airoli', 1),
  ('Ghansoli', 'ghansoli', 2),
  ('Kopar Khairane', 'kopar-khairane', 3),
  ('Rabale', 'rabale', 4),
  ('Mahape', 'mahape', 5),
  ('Turbhe', 'turbhe', 6),
  ('Vashi', 'vashi', 7),
  ('Sanpada', 'sanpada', 8),
  ('Juinagar', 'juinagar', 9),
  ('Nerul', 'nerul', 10),
  ('Seawoods', 'seawoods', 11),
  ('CBD Belapur', 'cbd-belapur', 12),
  ('Kharghar', 'kharghar', 13),
  ('Kamothe', 'kamothe', 14),
  ('Kalamboli', 'kalamboli', 15),
  ('Panvel', 'panvel', 16),
  ('Taloja', 'taloja', 17),
  ('Ulwe', 'ulwe', 18);

-- ============================================
-- SEED DATA: CATEGORIES
-- ============================================
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
  ('Restaurants & Cafes', 'restaurants-cafes', 'UtensilsCrossed', 1),
  ('Salons & Spas', 'salons-spas', 'Scissors', 2),
  ('Gyms & Fitness', 'gyms-fitness', 'Dumbbell', 3),
  ('Preschools & Education', 'preschools-education', 'GraduationCap', 4),
  ('Clothing & Fashion', 'clothing-fashion', 'Shirt', 5),
  ('Electronics', 'electronics', 'Smartphone', 6),
  ('Clinics & Wellness', 'clinics-wellness', 'HeartPulse', 7),
  ('Grocery & Daily Needs', 'grocery-daily-needs', 'ShoppingCart', 8),
  ('Home Services', 'home-services', 'Wrench', 9),
  ('Entertainment & Activities', 'entertainment-activities', 'Gamepad2', 10),
  ('Beauty', 'beauty', 'Sparkles', 11),
  ('Retail Stores', 'retail-stores', 'Store', 12);

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('shop-assets', 'shop-assets', true);

CREATE POLICY "Anyone can view shop assets" ON storage.objects FOR SELECT USING (bucket_id = 'shop-assets');
CREATE POLICY "Authenticated users can upload shop assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'shop-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'shop-assets' AND auth.role() = 'authenticated');
