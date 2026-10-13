import {enquirySchema} from '@/lib/enquiry';
import {isConfigured} from '@/lib/server-config';
function reply(body:object,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
async function handle(request:Request){
 const origin=request.headers.get('origin'); if(!origin||origin!==new URL(request.url).origin)return reply({error:'Please submit from this website.'},403);
 const contentType=request.headers.get('content-type')||'';const nativeForm=contentType.includes('application/x-www-form-urlencoded');
 if(!nativeForm&&!contentType.includes('application/json'))return reply({error:'A JSON request is required.'},415);
 if(Number(request.headers.get('content-length')||0)>16384)return reply({error:'Your enquiry is too large.'},413);
 let value:unknown;try{const reader=request.body?.getReader();if(!reader)return reply({error:'Missing request.'},400);let size=0;const chunks:Uint8Array[]=[];while(true){const {done,value:chunk}=await reader.read();if(done)break;size+=chunk.byteLength;if(size>16384){await reader.cancel();return reply({error:'Your enquiry is too large.'},413)}chunks.push(chunk)}const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}const text=new TextDecoder().decode(bytes);value=nativeForm?Object.fromEntries(new URLSearchParams(text)):JSON.parse(text)}catch{return reply({error:'Invalid enquiry format.'},400)}
 const parsed=enquirySchema.safeParse(value);if(!parsed.success)return reply({error:'Please check your enquiry fields.',fields:parsed.error.flatten().fieldErrors},400);
 if(!isConfigured())return reply({error:'Online submissions are not yet configured. Your enquiry has not been sent.'},503);
 // Use only trusted hosting-provided client IP headers. Never trust generic X-Forwarded-For.
 const ip=(process.env.VERCEL?request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim():request.headers.get('cf-connecting-ip')) || 'shared-fallback';
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(process.env.ENQUIRY_RATE_LIMIT_SALT+':'+ip));const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
 const {website,...enquiry}=parsed.data; void website;
 try{const r=await fetch(process.env.SUPABASE_URL!.replace(/\/$/,'')+'/rest/v1/rpc/submit_enquiry',{method:'POST',headers:{'Content-Type':'application/json',apikey:process.env.SUPABASE_SERVICE_ROLE_KEY!,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY!},body:JSON.stringify({p_payload:enquiry,p_hash:hash}),signal:AbortSignal.timeout(12000)});if(!r.ok)return reply({error:'We could not save your enquiry. Please try again later.'},502);const result=await r.json();if(result==='limited')return reply({error:'Too many enquiries. Please wait an hour before trying again.'},429);if(result!=='saved')return reply({error:'We could not confirm your submission. Please try again later.'},502);return reply({ok:true},201)}catch{return reply({error:'The enquiry service is temporarily unavailable. Please try again later.'},503)}
}

export async function POST(request:Request){
 const result=await handle(request);
 if(!request.headers.get('content-type')?.includes('application/x-www-form-urlencoded'))return result;
 const data=await result.json() as {ok?:boolean;error?:string};
 const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 const title=data.ok?'Enquiry received':'Enquiry not sent';
 const message=data.ok?'IRHA has received your enquiry. This is not a booking or visa approval.':data.error||'Please check your details and try again.';
 return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | IRHA ANSARI TRAVELS</title><style>body{font:17px/1.7 Arial,sans-serif;background:#f7f6f0;color:#143f35;padding:8%}main{max-width:650px;margin:auto;background:white;padding:40px;border:1px solid #dce2da;border-radius:8px}h1{font:38px Georgia,serif}a{display:inline-block;margin:16px 20px 0 0;color:#143f35}a:focus{outline:3px solid #bea476}</style></head><body><main><p>IRHA ANSARI TRAVELS</p><h1>${title}</h1><p>${escape(message)}</p><a href="/contact">Return to enquiry form</a><a href="/">Return home</a></main></body></html>`,{status:result.status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
