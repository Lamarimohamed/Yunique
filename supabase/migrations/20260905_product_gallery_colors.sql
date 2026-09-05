-- Add gallery and color metadata while retaining image for existing clients.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS colors text[] NOT NULL DEFAULT '{}';

UPDATE public.products
SET images = ARRAY[image]
WHERE COALESCE(array_length(images, 1), 0) = 0
  AND image IS NOT NULL;

DROP POLICY IF EXISTS "Admin-only order delete" ON public.orders;
CREATE POLICY "Admin-only order delete" ON public.orders
  FOR DELETE TO authenticated USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.id = auth.uid())
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END
$$;
