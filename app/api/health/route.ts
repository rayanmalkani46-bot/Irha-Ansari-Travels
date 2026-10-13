import {isConfigured} from '@/lib/server-config';
export const dynamic='force-dynamic';
export async function GET(){
 // Do not expose credentials, provider errors, record counts or enquiry data.
 if(!isConfigured())return Response.json({enquiries:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});
 try{
  const response=await fetch(process.env.SUPABASE_URL!.replace(/\/$/,'')+'/rest/v1/rpc/enquiry_health',{
   method:'POST',headers:{'Content-Type':'application/json',apikey:process.env.SUPABASE_SERVICE_ROLE_KEY!,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY!},body:'{}',signal:AbortSignal.timeout(5000)
  });
  const ready=response.ok&&await response.json()==='ready';
  return Response.json({enquiries:ready?'ready':'unavailable'},{status:ready?200:503,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({enquiries:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}})}
}
