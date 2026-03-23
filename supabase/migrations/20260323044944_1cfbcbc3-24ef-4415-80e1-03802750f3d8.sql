
-- Create a demo user in auth.users for seeding
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data, created_at, updated_at, confirmation_token)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'demo-owner@navimumbaioffers.com',
  crypt('DemoOwner2026!', gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  '{"full_name": "Demo Shop Owner", "role": "shop_owner"}'::jsonb,
  now(),
  now(),
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Insert profile and role for demo owner
INSERT INTO public.profiles (user_id, full_name) VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Shop Owner') ON CONFLICT DO NOTHING;
INSERT INTO public.user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000001', 'shop_owner') ON CONFLICT DO NOTHING;

-- Insert 12 demo shops
INSERT INTO shops (id, name, slug, description, full_address, phone, whatsapp, category_id, node_id, owner_id, status, is_verified, is_featured) VALUES
('a0000000-0000-0000-0000-000000000001', 'Masala Junction', 'masala-junction', 'Authentic North Indian cuisine with a modern twist. Known for butter chicken, biryanis, and tandoori specials.', 'Shop 14, Palm Beach Galleria, Vashi', '9876543210', '9876543210', '3c3ad6e1-f52f-4c11-9c2e-bb60815de68b', 'fc3dfe87-e939-4785-91f0-13149433d7ad', '00000000-0000-0000-0000-000000000001', 'approved', true, true),
('a0000000-0000-0000-0000-000000000002', 'Glow Studio Salon', 'glow-studio-salon', 'Premium unisex salon offering haircuts, coloring, facials, and bridal packages.', 'Atur Park, Sector 19, Kharghar', '9876543211', '9876543211', '5a83e584-5cf9-4048-9f9f-2c7820cda04b', '3c76265a-3ee0-4e30-a1b0-a2aaeada8ca2', '00000000-0000-0000-0000-000000000001', 'approved', true, true),
('a0000000-0000-0000-0000-000000000003', 'FitZone Gym', 'fitzone-gym', 'State-of-the-art gym with cardio, strength training, crossfit, and zumba classes.', 'Millennium Tower, Sector 10, Nerul', '9876543212', null, '143b4dd8-ccdd-4655-ada3-9bb929813556', '45974c83-196a-42ff-890b-d971edd46066', '00000000-0000-0000-0000-000000000001', 'approved', true, false),
('a0000000-0000-0000-0000-000000000004', 'TrendSet Fashion', 'trendset-fashion', 'Curated collection of western and ethnic wear for men and women.', 'Little World Mall, CBD Belapur', '9876543213', '9876543213', 'a0e5b4e1-0655-4b02-b9b9-3f0fcfe5828e', 'ffab1910-a782-48d3-84b9-e97bb01f953b', '00000000-0000-0000-0000-000000000001', 'approved', true, true),
('a0000000-0000-0000-0000-000000000005', 'GadgetHub Electronics', 'gadgethub-electronics', 'Authorized dealer for major electronics brands. Smartphones, laptops, accessories.', 'Orion Mall, Panvel', '9876543214', null, '40d1a4bd-b4b2-4864-8cdc-cbcb83690da5', '1880d477-1b37-41bb-a498-c26ab0001b94', '00000000-0000-0000-0000-000000000001', 'approved', true, false),
('a0000000-0000-0000-0000-000000000006', 'Chai & Chill Cafe', 'chai-and-chill-cafe', 'Cozy cafe with specialty teas, coffees, and light bites.', 'Sector 5, Airoli', '9876543215', '9876543215', '3c3ad6e1-f52f-4c11-9c2e-bb60815de68b', 'cba00f14-3c78-44d8-b9aa-554f4077ac18', '00000000-0000-0000-0000-000000000001', 'approved', true, true),
('a0000000-0000-0000-0000-000000000007', 'Dr. Sharma Dental Clinic', 'dr-sharma-dental', 'Modern dental care with painless procedures. Braces, implants, root canals.', 'NRI Complex, Seawoods', '9876543216', '9876543216', '1f42029d-fab0-4de7-8e19-a5804daaac73', '97f88dd1-0738-4777-8329-39d4ea8f71c1', '00000000-0000-0000-0000-000000000001', 'approved', true, false),
('a0000000-0000-0000-0000-000000000008', 'Fresh Basket Grocery', 'fresh-basket-grocery', 'Farm-fresh vegetables, fruits, dairy, and pantry staples.', 'Sector 12, Kopar Khairane', '9876543217', '9876543217', '649074fe-258e-45eb-b779-25d7fca11571', '099b2ab3-5843-4aa3-9c01-423bdbda050c', '00000000-0000-0000-0000-000000000001', 'approved', true, false),
('a0000000-0000-0000-0000-000000000009', 'Radiance Beauty Bar', 'radiance-beauty-bar', 'Luxury beauty treatments — microblading, lash extensions, chemical peels.', 'Inorbit Mall, Vashi', '9876543218', '9876543218', '3aadb1fc-2f55-424a-9572-a4ce3f724b4a', 'fc3dfe87-e939-4785-91f0-13149433d7ad', '00000000-0000-0000-0000-000000000001', 'approved', true, true),
('a0000000-0000-0000-0000-000000000010', 'PlayArena Entertainment', 'playarena-entertainment', 'Indoor gaming zone with VR, bowling, arcade games, and party packages.', 'Raghuleela Mall, Vashi', '9876543219', null, 'ed799440-f0ac-4aef-b2b3-42c2165ac376', 'fc3dfe87-e939-4785-91f0-13149433d7ad', '00000000-0000-0000-0000-000000000001', 'approved', true, false),
('a0000000-0000-0000-0000-000000000011', 'Spice Route Kitchen', 'spice-route-kitchen', 'Multi-cuisine restaurant — South Indian, Chinese, continental. Famous for weekend buffets.', 'Central Park, Kharghar', '9876543220', '9876543220', '3c3ad6e1-f52f-4c11-9c2e-bb60815de68b', '3c76265a-3ee0-4e30-a1b0-a2aaeada8ca2', '00000000-0000-0000-0000-000000000001', 'approved', true, false),
('a0000000-0000-0000-0000-000000000012', 'Urban Threads', 'urban-threads', 'Streetwear and casual fashion — sneakers, graphic tees, denim, accessories.', 'Seawoods Grand Central', '9876543221', '9876543221', 'a0e5b4e1-0655-4b02-b9b9-3f0fcfe5828e', '97f88dd1-0738-4777-8329-39d4ea8f71c1', '00000000-0000-0000-0000-000000000001', 'approved', true, false);

-- Direct offers
INSERT INTO offers (id, shop_id, title, description, offer_type, discount_text, coupon_code, status, is_active, is_featured, start_date, end_date, redemption_instructions, terms) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Flat 20% Off on Dinner', 'Get 20% off on your total dinner bill. Valid on dine-in orders above ₹500.', 'direct', '20% OFF', 'MASALA20', 'approved', true, true, CURRENT_DATE, CURRENT_DATE + 60, 'Show coupon code at billing counter', 'Dine-in only. Min order ₹500.'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'Free 7-Day Trial Pass', 'Experience FitZone with a complimentary week-long gym pass.', 'direct', 'FREE TRIAL', 'FIT7FREE', 'approved', true, false, CURRENT_DATE, CURRENT_DATE + 45, 'Show code at reception with valid ID', 'One trial per person. Must be 16+.'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', '₹500 Off on Smartphones', 'Flat ₹500 discount on any smartphone purchase above ₹10,000.', 'direct', '₹500 OFF', 'GADGET500', 'approved', true, false, CURRENT_DATE, CURRENT_DATE + 30, 'Mention code at billing', 'In-store only. One per customer.'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000007', 'Free Dental Checkup', 'Complimentary dental checkup and consultation worth ₹500.', 'direct', 'FREE', 'SMILE2026', 'approved', true, false, CURRENT_DATE, CURRENT_DATE + 90, 'Call to book. Mention coupon code.', 'First-time patients only.'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000008', '10% Off First Order', 'Get 10% off on your first grocery order.', 'direct', '10% OFF', 'FRESH10', 'approved', true, false, CURRENT_DATE, CURRENT_DATE + 30, 'Apply code during checkout', 'Min order ₹300.');

-- Scratch card offers
INSERT INTO offers (id, shop_id, title, description, offer_type, discount_text, coupon_code, status, is_active, is_featured, start_date, end_date, redemption_instructions, terms) VALUES
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Scratch & Win Salon Deals', 'Scratch to reveal your exclusive salon discount — up to 40% off!', 'scratch', 'Up to 40% OFF', 'GLOW40', 'approved', true, true, CURRENT_DATE, CURRENT_DATE + 30, 'Show scratched coupon at reception', 'Valid on services above ₹800.'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000006', 'Scratch for a Free Drink', 'Scratch the card to win a free specialty drink with any food order!', 'scratch', 'FREE DRINK', 'CHAI1FREE', 'approved', true, true, CURRENT_DATE, CURRENT_DATE + 21, 'Show to server when ordering', 'Dine-in only. One per table.'),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000011', 'Scratch & Save on Buffet', 'Scratch to reveal your buffet discount — 15% to 30% off!', 'scratch', 'Up to 30% OFF', 'SPICE30', 'approved', true, false, CURRENT_DATE, CURRENT_DATE + 45, 'Show scratched offer at restaurant', 'Weekend buffets only. Max 4 people.');

-- Spin wheel offers
INSERT INTO offers (id, shop_id, title, description, offer_type, discount_text, status, is_active, is_featured, start_date, end_date, redemption_instructions, terms) VALUES
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000004', 'Spin to Win Fashion Deals', 'Spin the wheel for exciting fashion discounts — 10% to 50% off!', 'spin', 'Up to 50% OFF', 'approved', true, true, CURRENT_DATE, CURRENT_DATE + 30, 'Show winning result at billing', 'Purchases above ₹1000. One spin per user.'),
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000009', 'Beauty Wheel of Fortune', 'Spin for a beauty surprise — free products, discounts, or upgrades!', 'spin', 'Mystery Prize', 'approved', true, true, CURRENT_DATE, CURRENT_DATE + 45, 'Show spin result at reception', 'One spin per user.'),
('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000010', 'Game Zone Lucky Spin', 'Spin the wheel for free gaming credits, bonus hours, or discounts!', 'spin', 'Win Credits', 'approved', true, false, CURRENT_DATE, CURRENT_DATE + 60, 'Show result at counter', 'Same-day redemption only.');

-- Spin outcomes for Fashion spin
INSERT INTO offer_spin_outcomes (offer_id, label, value, probability, is_winning, sort_order) VALUES
('b0000000-0000-0000-0000-000000000009', '10% Off', 'TREND10', 0.35, true, 0),
('b0000000-0000-0000-0000-000000000009', '20% Off', 'TREND20', 0.25, true, 1),
('b0000000-0000-0000-0000-000000000009', 'Better Luck!', null, 0.15, false, 2),
('b0000000-0000-0000-0000-000000000009', '30% Off', 'TREND30', 0.12, true, 3),
('b0000000-0000-0000-0000-000000000009', 'Free Scarf', 'FREESCARF', 0.08, true, 4),
('b0000000-0000-0000-0000-000000000009', '50% Off', 'TREND50', 0.05, true, 5);

-- Spin outcomes for Beauty spin
INSERT INTO offer_spin_outcomes (offer_id, label, value, probability, is_winning, sort_order) VALUES
('b0000000-0000-0000-0000-000000000010', '15% Off', 'RAD15', 0.30, true, 0),
('b0000000-0000-0000-0000-000000000010', 'Free Lipstick', 'FREELIP', 0.10, true, 1),
('b0000000-0000-0000-0000-000000000010', 'Try Again', null, 0.20, false, 2),
('b0000000-0000-0000-0000-000000000010', '25% Off', 'RAD25', 0.18, true, 3),
('b0000000-0000-0000-0000-000000000010', 'Deluxe Upgrade', 'DELUXE', 0.07, true, 4),
('b0000000-0000-0000-0000-000000000010', 'Free Facial', 'FREEFACIAL', 0.05, true, 5),
('b0000000-0000-0000-0000-000000000010', '₹200 Off', 'RAD200', 0.10, true, 6);

-- Spin outcomes for Gaming spin
INSERT INTO offer_spin_outcomes (offer_id, label, value, probability, is_winning, sort_order) VALUES
('b0000000-0000-0000-0000-000000000011', '50 Credits', 'PLAY50', 0.30, true, 0),
('b0000000-0000-0000-0000-000000000011', 'Nope!', null, 0.20, false, 1),
('b0000000-0000-0000-0000-000000000011', '100 Credits', 'PLAY100', 0.20, true, 2),
('b0000000-0000-0000-0000-000000000011', '1 Hour Free', 'FREE1HR', 0.10, true, 3),
('b0000000-0000-0000-0000-000000000011', '20% Off Party', 'PARTY20', 0.12, true, 4),
('b0000000-0000-0000-0000-000000000011', '200 Credits', 'PLAY200', 0.08, true, 5);
