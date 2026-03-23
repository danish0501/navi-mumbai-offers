
-- Fix analytics insert to only allow authenticated users
DROP POLICY "Anyone can insert analytics" ON public.analytics_events;
CREATE POLICY "Authenticated can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
