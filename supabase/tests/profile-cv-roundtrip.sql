-- Synthetic profile only. The complete test transaction is rolled back.
begin;
do $$
declare
 test_slug text:='qa-cv-'||gen_random_uuid()::text;
 test_code text:='5TAP-CVQA-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));
 document_id text:=gen_random_uuid()::text;
 replacement_id text:=gen_random_uuid()::text;
 pdf bytea:=convert_to('%PDF-1.4'||chr(10)||'Synthetic CV test only'||chr(10)||'%%EOF'||chr(10),'UTF8');
 data_url text;
 document jsonb;
 saved jsonb;
 owner_profile jsonb;
 published jsonb;
 failed boolean:=false;
begin
 data_url:='data:application/pdf;base64,'||replace(encode(pdf,'base64'),chr(10),'');
 document:=jsonb_build_object('id',document_id,'name','cv-test.pdf','mimeType','application/pdf','size',octet_length(pdf),'label','Mon CV','dataUrl',data_url);
 insert into public.card_profiles(activation_code_hash,public_slug) values(encode(extensions.digest(test_code,'sha256'),'hex'),test_slug);
 if public.get_public_card_document(test_slug,document_id) is not null then raise exception 'Unpublished document exposed'; end if;
 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','Profil test CV','jobTitle','Designer','cvDocument',document));
 if saved->'cv_document'->>'id'<>document_id or saved->'cv_document' ? 'dataUrl' then raise exception 'Save response is not metadata only'; end if;
 owner_profile:=public.get_card_profile(test_code);
 if owner_profile->'cv_document' ? 'dataUrl' or owner_profile->>'job_title'<>'Designer' then raise exception 'Owner reload lost identity or exposed bytes'; end if;
 published:=public.get_public_card_profile(test_slug);
 if published->'cv_document' ? 'dataUrl' or published ? 'activation_code_hash' then raise exception 'Public profile exposes private payload'; end if;
 if public.get_public_card_document(test_slug,document_id)->>'dataUrl' is distinct from data_url then raise exception 'Public document not available'; end if;

 -- Older clients omit the field; a normal identity edit must preserve the document.
 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','Profil test modifie','jobTitle','Designer'));
 if saved->'cv_document'->>'id'<>document_id then raise exception 'Legacy edit lost CV'; end if;
 -- New clients retain only the reference and can edit the button label.
 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','Profil test modifie','jobTitle','Designer','cvDocument',(document-'dataUrl')||jsonb_build_object('label','Mon parcours')));
 if saved->'cv_document'->>'label'<>'Mon parcours' or public.get_public_card_document(test_slug,document_id)->>'dataUrl' is distinct from data_url then raise exception 'Metadata edit lost file'; end if;
 begin
  perform public.update_card_profile(test_code,jsonb_build_object('displayName','Should roll back','cvDocument',document||jsonb_build_object('dataUrl','data:application/pdf;base64,AAAA')));
 exception when others then failed:=true;
 end;
 if not failed or public.get_card_profile(test_code)->>'display_name'<>'Profil test modifie' then raise exception 'Invalid document changed identity'; end if;
 failed:=false;
 begin
  perform public.update_card_profile(test_code,jsonb_build_object('displayName','Should roll back','cvDocument',(document-'dataUrl')||jsonb_build_object('id',replacement_id)));
 exception when others then failed:=true;
 end;
 if not failed then raise exception 'Unrelated document reference accepted'; end if;

 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','Profil test modifie','cvDocument',document||jsonb_build_object('id',replacement_id)));
 if public.get_public_card_document(test_slug,document_id) is not null or public.get_public_card_document(test_slug,replacement_id) is null then raise exception 'Replaced reference still exposed'; end if;
 update public.card_profiles set is_active=false where public_slug=test_slug;
 if public.get_public_card_document(test_slug,replacement_id) is not null then raise exception 'Disabled profile document exposed'; end if;
 update public.card_profiles set is_active=true where public_slug=test_slug;
 if public.update_card_profile('5TAP-WRNG-CODE',jsonb_build_object('displayName','Test','cvDocument',null)) is not null then raise exception 'Invalid activation accepted'; end if;
 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','Profil test modifie','cvDocument',null));
 if public.get_public_card_document(test_slug,replacement_id) is not null or saved->'cv_document'<>'null'::jsonb then raise exception 'Removed document still exposed'; end if;
 if has_function_privilege('anon','public.update_card_profile_without_cv(text,jsonb)','EXECUTE')
 or has_function_privilege('anon','public.get_card_profile_without_cv(text)','EXECUTE')
 or has_function_privilege('anon','public.get_public_card_profile_without_cv(text)','EXECUTE')
 or has_table_privilege('anon','public.card_profiles','SELECT') then raise exception 'Raw profile access permitted'; end if;
end $$;
rollback;
select 'CV save, reload, metadata, replacement, removal, identity and access tests passed. No test profile retained.' as result;
