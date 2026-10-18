-- Activate RLS, restrict guest INSERTs to website order requests, and deny
-- client access to existing orders. The storefront uses return=minimal.
-- Table-owner / service-role administration is unchanged.
begin;
alter table public.orders enable row level security;
revoke all on table public.orders from public, anon, authenticated;
grant insert on table public.orders to anon, authenticated;
drop policy if exists "Allow anonymous website orders" on public.orders;
drop policy if exists "Public can insert orders" on public.orders;
create policy "Allow anonymous website orders" on public.orders
for insert to anon, authenticated
with check (
  source='website'
  and status='awaiting_whatsapp_confirmation'
  and jsonb_typeof(items)='array'
  and jsonb_array_length(items) between 1 and 50
  and subtotal>=0 and shipping>=0 and total>=0
  and total<=subtotal+shipping
);
commit;

-- Inspect security state without returning customer data.
select c.relrowsecurity as rls_enabled,
       has_table_privilege('anon','public.orders','INSERT') as anonymous_insert,
       has_table_privilege('anon','public.orders','SELECT') as anonymous_select,
       has_table_privilege('anon','public.orders','UPDATE') as anonymous_update,
       has_table_privilege('anon','public.orders','DELETE') as anonymous_delete,
       (select string_agg(policyname || ' | ' || cmd || ' | ' || roles::text || ' | ' || coalesce(with_check,qual,''), E'\n')
        from pg_policies where schemaname='public' and tablename='orders') as policies
from pg_class c
where c.oid='public.orders'::regclass;
