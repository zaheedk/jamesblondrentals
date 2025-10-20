-- Ensure the admin role exists for the specified email via auth.users
-- Note: Selecting from auth.users is allowed in migrations; we are not modifying the schema

-- Double-check the enum exists (no-op if already created)
DO $$ BEGIN
  PERFORM 1 FROM pg_type WHERE typname = 'app_role';
  IF NOT FOUND THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- Ensure user_roles table exists (no-op if already created)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Insert admin role for the known admin email using auth.users
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'zaheedk@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Recreate a robust is_admin_user() helper using SECURITY DEFINER if missing
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    WHERE r.user_id = auth.uid()
      AND r.role = 'admin'
  );
$$;
