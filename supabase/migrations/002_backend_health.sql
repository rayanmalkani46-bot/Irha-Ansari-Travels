-- Run after 001_enquiries.sql. No enquiry data is returned.
create or replace function public.enquiry_health()
returns text language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if to_regclass('public.enquiries') is null or to_regclass('public.enquiry_rate_limits') is null
 or to_regprocedure('public.submit_enquiry(jsonb,text)') is null then
  return 'unavailable';
 end if;
 return 'ready';
end; $$;
revoke all on function public.enquiry_health() from public,anon,authenticated;
grant execute on function public.enquiry_health() to service_role;
