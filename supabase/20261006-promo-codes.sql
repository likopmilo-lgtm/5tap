BEGIN;
CREATE TABLE IF NOT EXISTS public.promo_codes (
 code text PRIMARY KEY CHECK (code = upper(code) AND code ~ '^[A-Z0-9_-]{1,32}$'),
 discount_percent numeric NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
 active boolean NOT NULL DEFAULT true,
 expires_at timestamptz,
 minimum_order numeric NOT NULL DEFAULT 0 CHECK (minimum_order >= 0),
 collaborator text,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.promo_codes FROM anon, authenticated;
INSERT INTO public.promo_codes (code,discount_percent,expires_at,collaborator)
VALUES ('STATI',15,NULL,'STATI') ON CONFLICT(code) DO NOTHING;
CREATE OR REPLACE FUNCTION public.quote_promo(p_code text,p_subtotal numeric)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT jsonb_build_object('code',code,'discount',round(p_subtotal*discount_percent/100,2))
 FROM public.promo_codes
 WHERE code=upper(trim(p_code)) AND active AND (expires_at IS NULL OR expires_at>now())
 AND p_subtotal>=minimum_order AND p_subtotal>0;
$$;
REVOKE ALL ON FUNCTION public.quote_promo(text,numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.quote_promo(text,numeric) TO anon, authenticated;
COMMIT;
