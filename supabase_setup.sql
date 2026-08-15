-- 1. Create the `admins` table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a default admin user (change the password in production)
INSERT INTO public.admins (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- 2. Create the `products` table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  sizes text[] NOT NULL DEFAULT '{}',
  is_new boolean DEFAULT false,
  collection text,
  is_draft boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the `orders` table
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) for all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- To make this work seamlessly with the Anon key from the frontend for now, we will allow all operations (public access).
-- For production, you should restrict INSERT/UPDATE/DELETE to authenticated users only.

-- Products: Allow anyone to read, insert, update, and delete
CREATE POLICY "Allow public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access for products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access for products" ON public.products FOR DELETE USING (true);

-- Orders: Allow anyone to read, insert, and update
CREATE POLICY "Allow public read access for orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access for orders" ON public.orders FOR UPDATE USING (true);

-- Admins: Allow anyone to read (needed for the custom login flow)
CREATE POLICY "Allow public read access for admins" ON public.admins FOR SELECT USING (true);
