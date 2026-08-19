-- ============================================================
--  ADMIN AUTH WHITELIST SETUP  (Run this in Supabase SQL Editor)
-- ============================================================
--  Step 1: create an admin whitelist table linked to auth.uid()
--  Step 2: grant Hachemchetouane16@gmail.com admin privileges
--  Step 3 (optional): set role=admin on auth.users raw_app_meta_data
-- ============================================================

-- 1) Create admin whitelist table (only allowed admins can access /admin)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 2) Enable RLS on admin_users so only real admins can read/write it
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: any authenticated user can check if they are an admin
CREATE POLICY "Admin users viewable by authenticated" ON public.admin_users
    FOR SELECT TO authenticated USING (true);

-- Policy: only existing admins can add new admins (or postgres/superuser)
CREATE POLICY "Only admins can insert new admins" ON public.admin_users
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
    );

CREATE POLICY "Only admins can delete admins" ON public.admin_users
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
    );

-- 3) 🚨  GIVE ADMIN TO Hachemchetouane16@gmail.com  🚨
--     Make sure the user already exists in Supabase Auth tab!
INSERT INTO public.admin_users (id, email)
VALUES (
    '168da884-6616-4e8f-91a1-1bac92904167',
    'Hachemchetouane16@gmail.com'
)
ON CONFLICT (id) DO NOTHING;

-- 4) Also update auth.users raw_app_meta_data so Supabase itself knows he's admin
--    (This is the "proper" Supabase way to assign roles — used in RLS policies)
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
WHERE id = '168da884-6616-4e8f-91a1-1bac92904167'
  AND (raw_app_meta_data IS NULL OR (raw_app_meta_data->>'role') IS DISTINCT FROM 'admin');

-- 5) Hardening — fix the broken secure_policies.sql:
--    The current policies say "FOR UPDATE TO authenticated" which means
--    ANY signed-in user can edit products/orders, not just admins.
--    We fix them so only users with app_metadata.role='admin' OR
--    present in public.admin_users can modify data.

-- Drop the too-open secure policies if they exist
DROP POLICY IF EXISTS "Allow admin insert access for products" ON public.products;
DROP POLICY IF EXISTS "Allow admin update access for products" ON public.products;
DROP POLICY IF EXISTS "Allow admin delete access for products" ON public.products;
DROP POLICY IF EXISTS "Allow admin update access for orders"   ON public.orders;

-- (Re)create the public SELECT policies in case secure_policies dropped them
CREATE POLICY IF NOT EXISTS "Public can view products"
    ON public.products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view orders"
    ON public.orders   FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Customers can place orders"
    ON public.orders   FOR INSERT WITH CHECK (true);

-- Now the ACTUAL admin-only policies (work with BOTH admin_users table AND app_metadata.role)
CREATE POLICY "Admin-only product insert" ON public.products
    FOR INSERT TO authenticated WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
    );

CREATE POLICY "Admin-only product update" ON public.products
    FOR UPDATE TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
    );

CREATE POLICY "Admin-only product delete" ON public.products
    FOR DELETE TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
    );

CREATE POLICY "Admin-only order status update" ON public.orders
    FOR UPDATE TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
    );
