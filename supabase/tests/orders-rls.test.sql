-- Run after 20261018-enable-orders-rls.sql in the SQL Editor as postgres.
-- No customer data is returned. The synthetic order is rolled back.
-- Refuse the insertion test if any user trigger could cause external effects.
begin;
do $$
begin
  if not (select relrowsecurity from pg_class where oid='public.orders'::regclass) then
    raise exception 'orders RLS must be enabled';
  end if;
  if not has_table_privilege('anon','public.orders','INSERT') then
    raise exception 'Guest checkout requires INSERT';
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='orders'
      and cmd in ('INSERT','ALL')
      and roles && array['public','anon']::name[]
  ) then
    raise exception 'Guest checkout requires an INSERT policy';
  end if;
  if has_table_privilege('anon','public.orders','SELECT')
     or has_table_privilege('anon','public.orders','UPDATE')
     or has_table_privilege('anon','public.orders','DELETE')
     or has_table_privilege('authenticated','public.orders','SELECT')
     or has_table_privilege('authenticated','public.orders','UPDATE')
     or has_table_privilege('authenticated','public.orders','DELETE') then
    raise exception 'Client roles must not read or change existing orders';
  end if;
  if exists(select 1 from pg_trigger where tgrelid='public.orders'::regclass and not tgisinternal) then
    raise exception 'Inspect order triggers before running the rolled-back insert test';
  end if;
end $$;

select set_config('fivetap.rls_test_id',gen_random_uuid()::text,true);
set local role anon;
insert into public.orders(id,name,phone,city,address,items,subtotal,shipping,total,notes,status,source)
values(current_setting('fivetap.rls_test_id')::uuid,'TEST RLS - ROLLBACK','+212600000000','Test','Test sans livraison',
       '[{"id":"essentiel","name":"TEST RLS","quantity":1,"price":1}]'::jsonb,
       1,0,1,'Test transactionnel, aucune commande réelle.','awaiting_whatsapp_confirmation','website');
do $$
begin
  begin
    perform id from public.orders limit 0;
    raise exception 'Unexpected anonymous order read access';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.orders set notes=notes where false;
    raise exception 'Unexpected anonymous order update access';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.orders where false;
    raise exception 'Unexpected anonymous order delete access';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.orders(id,name,phone,city,address,items,subtotal,shipping,total,status,source)
    values(gen_random_uuid(),'TEST INTERDIT','+212600000000','Test','Test sans livraison',
           '[{"id":"essentiel","quantity":1}]'::jsonb,1,0,1,'awaiting_whatsapp_confirmation','invalid_source');
    raise exception 'Unexpected insert accepted from an invalid source';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
do $$ begin
  if not exists(select 1 from public.orders where id=current_setting('fivetap.rls_test_id')::uuid) then
    raise exception 'Guest insert was not saved inside the test transaction';
  end if;
end $$;
rollback;
select 'Order RLS and client access checks passed' as result, true as guest_insert_verified;
