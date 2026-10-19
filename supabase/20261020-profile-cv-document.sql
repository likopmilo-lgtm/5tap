-- Optional CV/document. Existing activation, identity, cover and portfolio are preserved.
-- Documents remain in Supabase and are fetched separately from profile metadata.
begin;
alter table public.card_profiles add column if not exists cv_document jsonb;

do $$
begin
 if to_regprocedure('public.update_card_profile_without_cv(text,jsonb)') is null then
  alter function public.update_card_profile(text,jsonb) rename to update_card_profile_without_cv;
 end if;
 if to_regprocedure('public.get_card_profile_without_cv(text)') is null then
  alter function public.get_card_profile(text) rename to get_card_profile_without_cv;
 end if;
 if to_regprocedure('public.get_public_card_profile_without_cv(text)') is null then
  alter function public.get_public_card_profile(text) rename to get_public_card_profile_without_cv;
 end if;
end $$;

create or replace function public.card_document_summary(document jsonb)
returns jsonb language sql immutable set search_path = '' as $$
 select case when jsonb_typeof(document)='object' then jsonb_build_object(
  'id',document->'id','name',document->'name','mimeType',document->'mimeType',
  'size',document->'size','label',document->'label') else null end;
$$;

create or replace function public.get_card_profile(p_activation_code text)
returns jsonb language sql stable security definer set search_path = '' as $$
 select case when p is null then null else (p-'cv_document')||jsonb_build_object('cv_document',public.card_document_summary(p->'cv_document')) end
 from (select public.get_card_profile_without_cv(p_activation_code) as p) source;
$$;

create or replace function public.get_public_card_profile(p_slug text)
returns jsonb language sql stable security definer set search_path = '' as $$
 select case when p is null then null else (p-'cv_document')||jsonb_build_object('cv_document',public.card_document_summary(p->'cv_document')) end
 from (select public.get_public_card_profile_without_cv(p_slug) as p) source;
$$;

create or replace function public.update_card_profile(p_activation_code text,p_profile jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 saved jsonb;
 current_document jsonb;
 requested jsonb;
 requested_id text;
 requested_name text;
 requested_label text;
 requested_mime text;
 requested_size integer;
 prefix text;
 encoded text;
 file_bytes bytea;
begin
 saved:=public.update_card_profile_without_cv(p_activation_code,p_profile);
 if saved is null then return null; end if;
 if not (p_profile ? 'cvDocument') then
  return (saved-'cv_document')||jsonb_build_object('cv_document',public.card_document_summary(saved->'cv_document'));
 end if;
 requested:=p_profile->'cvDocument';
 if requested is null or requested='null'::jsonb then
  update public.card_profiles set cv_document=null where id=(saved->>'id')::uuid;
  return (saved-'cv_document')||jsonb_build_object('cv_document',null);
 end if;
 if jsonb_typeof(requested)<>'object' then raise exception 'Document invalide'; end if;
 requested_id:=coalesce(requested->>'id','');
 requested_label:=left(trim(coalesce(requested->>'label','Mon CV')),60);
 if requested_label='' then requested_label:='Mon CV'; end if;
 if requested_id !~* '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' then raise exception 'Reference de document invalide'; end if;
 select cv_document into current_document from public.card_profiles where id=(saved->>'id')::uuid;
 if not (requested ? 'dataUrl') then
  if current_document is null or current_document->>'id' is distinct from requested_id then raise exception 'Document existant introuvable'; end if;
  requested:=current_document||jsonb_build_object('label',requested_label);
 else
  requested_name:=trim(coalesce(requested->>'name',''));
  requested_mime:=coalesce(requested->>'mimeType','');
  if length(requested_name)>120 or requested_name ~ '[[:cntrl:]/\\]' then raise exception 'Nom de fichier invalide'; end if;
  if not ((requested_name ~* '\.pdf$' and requested_mime='application/pdf')
   or (requested_name ~* '\.doc$' and requested_mime='application/msword')
   or (requested_name ~* '\.docx$' and requested_mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document')) then raise exception 'Format de document invalide'; end if;
  if coalesce(requested->>'size','') !~ '^[0-9]{1,8}$' then raise exception 'Taille de document invalide'; end if;
  requested_size:=(requested->>'size')::integer;
  if requested_size<1 or requested_size>5242880 then raise exception 'Document limite a 5 Mo'; end if;
  prefix:='data:'||requested_mime||';base64,';
  if jsonb_typeof(requested->'dataUrl')<>'string' or left(requested->>'dataUrl',length(prefix))<>prefix then raise exception 'Document invalide'; end if;
  encoded:=substring(requested->>'dataUrl' from length(prefix)+1);
  if length(encoded)>6990508 or length(encoded)%4<>0 or encoded !~ '^[A-Za-z0-9+/]+={0,2}$' then raise exception 'Document invalide'; end if;
  file_bytes:=decode(encoded,'base64');
  if octet_length(file_bytes)<>requested_size then raise exception 'Taille de document incorrecte'; end if;
  if requested_mime='application/pdf' then
   if substring(file_bytes from 1 for 5)<>convert_to('%PDF-','UTF8')
    or position(convert_to('%%EOF','UTF8') in substring(file_bytes from greatest(1,requested_size-1023)))=0 then raise exception 'PDF invalide'; end if;
  elsif requested_mime='application/msword' then
   if substring(file_bytes from 1 for 8)<>decode('D0CF11E0A1B11AE1','hex') then raise exception 'DOC invalide'; end if;
  else
   if substring(file_bytes from 1 for 4)<>decode('504B0304','hex')
    or position(convert_to('[Content_Types].xml','UTF8') in file_bytes)=0
    or position(convert_to('word/document.xml','UTF8') in file_bytes)=0
    or position(convert_to('vbaProject.bin','UTF8') in file_bytes)>0 then raise exception 'DOCX invalide'; end if;
  end if;
  requested:=jsonb_build_object('id',requested_id,'name',requested_name,'label',requested_label,
   'mimeType',requested_mime,'size',requested_size,'dataUrl',requested->>'dataUrl');
 end if;
 update public.card_profiles set cv_document=requested where id=(saved->>'id')::uuid;
 return (saved-'cv_document')||jsonb_build_object('cv_document',public.card_document_summary(requested));
end;
$$;

create or replace function public.get_public_card_document(p_slug text,p_document_id text)
returns jsonb language sql stable security definer set search_path = '' as $$
 select p.cv_document from public.card_profiles p
 where p.public_slug=lower(trim(p_slug)) and p.is_active and p.published_at is not null
 and length(trim(p.display_name))>=2 and p.cv_document->>'id'=p_document_id;
$$;

-- Private implementations cannot bypass the public metadata-only responses.
revoke all on function public.update_card_profile_without_cv(text,jsonb) from public,anon,authenticated;
revoke all on function public.get_card_profile_without_cv(text) from public,anon,authenticated;
revoke all on function public.get_public_card_profile_without_cv(text) from public,anon,authenticated;
revoke all on function public.card_document_summary(jsonb) from public,anon,authenticated;
revoke all on function public.update_card_profile(text,jsonb) from public;
revoke all on function public.get_card_profile(text) from public;
revoke all on function public.get_public_card_profile(text) from public;
revoke all on function public.get_public_card_document(text,text) from public;
grant execute on function public.update_card_profile(text,jsonb) to anon,authenticated;
grant execute on function public.get_card_profile(text) to anon,authenticated;
grant execute on function public.get_public_card_profile(text) to anon,authenticated;
grant execute on function public.get_public_card_document(text,text) to anon,authenticated;
notify pgrst, 'reload schema';
commit;
select 'CV/document support installed; existing profiles unchanged.' as result;
