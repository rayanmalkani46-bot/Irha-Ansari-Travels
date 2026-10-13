-- Run in the Supabase SQL editor. Client roles have no access to either table or RPC.
create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 agency text not null, contact text not null, email text not null, phone text not null,
 service text not null check(service in ('group','individual','long-stay','hotel','catering','transport')),
 travellers integer not null check(travellers between 1 and 10000),
 travel_date date, message text not null default ''
);
create table if not exists public.enquiry_rate_limits (
 client_hash text primary key, window_start timestamptz not null, attempts integer not null
);
alter table public.enquiries enable row level security;
alter table public.enquiry_rate_limits enable row level security;
revoke all on public.enquiries, public.enquiry_rate_limits from anon, authenticated;
create or replace function public.submit_enquiry(p_payload jsonb,p_hash text)
returns text language plpgsql security definer set search_path=public,pg_temp as $$
declare count_attempts integer;
begin
 -- Atomically lock the client bucket: at most 5 persisted submissions per hour.
 insert into public.enquiry_rate_limits values(p_hash,now(),1)
 on conflict(client_hash) do update set
 attempts=case when enquiry_rate_limits.window_start < now()-interval '1 hour' then 1 else enquiry_rate_limits.attempts+1 end,
 window_start=case when enquiry_rate_limits.window_start < now()-interval '1 hour' then now() else enquiry_rate_limits.window_start end
 returning attempts into count_attempts;
 if count_attempts>5 then return 'limited'; end if;
 insert into public.enquiries(agency,contact,email,phone,service,travellers,travel_date,message)
 values(p_payload->>'agency',p_payload->>'contact',p_payload->>'email',p_payload->>'phone',p_payload->>'service',(p_payload->>'travellers')::integer,nullif(p_payload->>'travelDate','')::date,p_payload->>'message');
 delete from public.enquiry_rate_limits where window_start<now()-interval '2 days';
 return 'saved';
end; $$;
revoke all on function public.submit_enquiry(jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_enquiry(jsonb,text) to service_role;
