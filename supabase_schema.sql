-- =========================================================================
-- AHAVA BUSINESS HUB: SUPABASE POSTGRESQL DATABASE SCHEMA & SECURITY POLICIES
-- Tagline: Connecting Businesses to More Customers.
-- Instructions: Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT DEFAULT 'Folder',
  description TEXT,
  count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY DEFAULT ('biz-' || gen_random_uuid()),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  images TEXT[] DEFAULT '{}',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  website TEXT,
  opening_hours TEXT,
  products_services TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  package_tier TEXT DEFAULT 'free' CHECK (package_tier IN ('free', 'standard', 'premium')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  rejection_reason TEXT,
  views INT DEFAULT 0,
  whatsapp_clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 5. ADVERTS TABLE
CREATE TABLE IF NOT EXISTS public.adverts (
  id TEXT PRIMARY KEY DEFAULT ('adv-' || gen_random_uuid()),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  business_id TEXT REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_name TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) DEFAULT 0,
  is_negotiable BOOLEAN DEFAULT FALSE,
  images TEXT[] DEFAULT '{}',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  external_url TEXT,
  package_tier TEXT DEFAULT 'standard' CHECK (package_tier IN ('standard', 'featured', 'premium')),
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  rejection_reason TEXT,
  duration_days INT DEFAULT 30,
  views INT DEFAULT 0,
  whatsapp_clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 6. PRICING PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('listing', 'advert', 'banner')),
  price NUMERIC(10, 2) NOT NULL,
  duration_days INT NOT NULL,
  duration_label TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  badge TEXT,
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BANNER ADS TABLE
CREATE TABLE IF NOT EXISTS public.banner_ads (
  id TEXT PRIMARY KEY DEFAULT ('ban-' || gen_random_uuid()),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('homepage_top', 'homepage_middle', 'sidebar')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  advertiser_name TEXT NOT NULL,
  advertiser_email TEXT NOT NULL,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS & TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay-' || gen_random_uuid()),
  reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('listing', 'advert', 'banner')),
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  channel TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADVERT REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.advert_reports (
  id TEXT PRIMARY KEY DEFAULT ('rep-' || gen_random_uuid()),
  advert_id TEXT REFERENCES public.adverts(id) ON DELETE CASCADE,
  advert_title TEXT NOT NULL,
  reporter_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adverts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advert_reports ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Anyone can view public basic info; users can update own profile; admin full access
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Public can view; only admins can insert, update, or delete
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Businesses: Public reads approved businesses; Owners can CRUD their own; Admins manage all
CREATE POLICY "Public read approved businesses" ON public.businesses FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create business" ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own business" ON public.businesses FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users delete own business" ON public.businesses FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- Adverts: Public reads approved adverts; Owners manage their own; Admins manage all
CREATE POLICY "Public read approved adverts" ON public.adverts FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create advert" ON public.adverts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own advert" ON public.adverts FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users delete own advert" ON public.adverts FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- Pricing Packages: Public reads active; admins manage
CREATE POLICY "Public read active packages" ON public.pricing_packages FOR SELECT USING (true);
CREATE POLICY "Admins manage packages" ON public.pricing_packages FOR ALL USING (public.is_admin());

-- Banners: Public read active; admins manage
CREATE POLICY "Public read active banners" ON public.banner_ads FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage banners" ON public.banner_ads FOR ALL USING (public.is_admin());

-- Payments: Users view own payments; Admins view all; Inserts allowed via authenticated or webhook
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Create payment record" ON public.payments FOR INSERT WITH CHECK (true);

-- Reports: Public can insert report; Admins can view and update
CREATE POLICY "Anyone report advert" ON public.advert_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view reports" ON public.advert_reports FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins update reports" ON public.advert_reports FOR UPDATE USING (public.is_admin());
