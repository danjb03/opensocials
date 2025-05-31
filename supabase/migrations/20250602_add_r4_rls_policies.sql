-- Enable RLS and create policies for r4 tables

-- r4_rules table
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'r4_rules') THEN
    ALTER TABLE public.r4_rules ENABLE ROW LEVEL SECURITY;
    
    BEGIN
      CREATE POLICY "Allow read for admins or service role" ON public.r4_rules
        FOR SELECT
        USING (auth.role() = 'service_role' OR public.is_admin_user());
    EXCEPTION
      WHEN duplicate_object THEN null;
    END;

    BEGIN
      CREATE POLICY "Allow write for admins or service role" ON public.r4_rules
        FOR ALL
        USING (auth.role() = 'service_role' OR public.is_admin_user())
        WITH CHECK (auth.role() = 'service_role' OR public.is_admin_user());
    EXCEPTION
      WHEN duplicate_object THEN null;
    END;
  END IF;
END $$;

-- r4_enforcement_logs table
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'r4_enforcement_logs') THEN
    ALTER TABLE public.r4_enforcement_logs ENABLE ROW LEVEL SECURITY;
    
    BEGIN
      CREATE POLICY "Allow insert for service role" ON public.r4_enforcement_logs
        FOR INSERT
        WITH CHECK (auth.role() = 'service_role');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END;

    BEGIN
      CREATE POLICY "Allow admin or service role read" ON public.r4_enforcement_logs
        FOR SELECT
        USING (auth.role() = 'service_role' OR public.is_admin_user());
    EXCEPTION
      WHEN duplicate_object THEN null;
    END;
  END IF;
END $$;

