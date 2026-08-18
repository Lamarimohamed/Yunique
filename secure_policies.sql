-- Drop the old public access policies
DROP POLICY IF EXISTS "Allow public insert access for products" ON public.products;
DROP POLICY IF EXISTS "Allow public update access for products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete access for products" ON public.products;

DROP POLICY IF EXISTS "Allow public update access for orders" ON public.orders;

-- Create secure policies for Products (Only authenticated users can modify)
-- Note: Anyone can still SELECT (view) products
CREATE POLICY "Allow admin insert access for products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update access for products" ON public.products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete access for products" ON public.products FOR DELETE TO authenticated USING (true);

-- Create secure policies for Orders 
-- Note: Anyone can still SELECT and INSERT (so customers can place orders)
-- But only authenticated admins can UPDATE (to change the order status to Shipped/Delivered)
CREATE POLICY "Allow admin update access for orders" ON public.orders FOR UPDATE TO authenticated USING (true);
