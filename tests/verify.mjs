import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const target='.verification';fs.mkdirSync(target,{recursive:true});
for(const [input,output] of [['lib/content.ts','content.js'],['lib/server-config.ts','server-config.js'],['lib/enquiry.ts','enquiry.js'],['app/api/enquiries/route.ts','route.js'],['app/api/health/route.ts','health.js']]){
 const source=fs.readFileSync(input,'utf8').replace("'./content'","'./content.js'").replace("'@/lib/enquiry'","'./enquiry.js'").replace("'@/lib/server-config'","'./server-config.js'");
 fs.writeFileSync(path.join(target,output),ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
}
const {enquirySchema}=await import('../.verification/enquiry.js');
const {POST}=await import('../.verification/route.js');
const {GET}=await import('../.verification/health.js');
const sample={agency:'Test Agency',contact:'Test Contact',email:'agent@example.com',phone:'+919876543210',service:'group',travellers:5,travelDate:'',message:'Please send requirements.',website:''};
let checks=0;function check(value,label){assert.ok(value,label);console.log('PASS '+label);checks++}
check(enquirySchema.safeParse(sample).success,'valid enquiry');
for(const [key,value] of [['agency',''],['email','invalid'],['phone','1234'],['service','invented'],['travellers',0],['travellers',1.5],['travelDate','2020-01-01'],['travelDate','2099-02-30'],['website','spam'],['message','x'.repeat(3001)]])check(!enquirySchema.safeParse({...sample,[key]:value}).success,'reject invalid '+key);
const request=(body=sample,headers={})=>new Request('https://irha.test/api/enquiries',{method:'POST',headers:{origin:'https://irha.test','content-type':'application/json',...headers},body:JSON.stringify(body)});
check((await POST(request(sample,{origin:'https://attacker.test'}))).status===403,'reject cross-origin request');
check((await POST(request(sample,{'content-type':'text/plain'}))).status===415,'reject non-JSON');
check((await POST(request({...sample,message:'x'.repeat(17000)}))).status===413,'reject oversized streamed body');
check((await POST(request({...sample,email:'bad'}))).status===400,'server validates fields');
delete process.env.SUPABASE_URL;delete process.env.SUPABASE_SERVICE_ROLE_KEY;delete process.env.ENQUIRY_RATE_LIMIT_SALT;
check((await POST(request())).status===503,'unconfigured endpoint never reports success');
check((await GET()).status===503,'health rejects missing configuration');
const nativeRequest=(body=sample)=>new Request('https://irha.test/api/enquiries',{method:'POST',headers:{origin:'https://irha.test','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams(Object.entries(body).map(([k,v])=>[k,String(v)])).toString()});
const nativeResponse=await POST(nativeRequest());
check(nativeResponse.status===503,'native form correctly reports unconfigured backend');
check(nativeResponse.headers.get('content-type').includes('text/html'),'native form returns a readable result page');
check((await nativeResponse.text()).includes('Enquiry not sent'),'native form never fabricates success');
check((await POST(nativeRequest({...sample,email:'invalid'}))).status===400,'native form validates on server');

process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';process.env.ENQUIRY_RATE_LIMIT_SALT='test-only';
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>Response.json('ready');check((await GET()).status===200,'health confirms schema readiness (mocked database)');
globalThis.fetch=async()=>Response.json('unavailable');check((await GET()).status===503,'health rejects incomplete schema');
globalThis.fetch=async()=>{throw new Error('offline')};check((await GET()).status===503,'health handles unavailable database');
globalThis.fetch=async()=>Response.json('saved');check((await POST(request())).status===201,'confirmed persistence reports success (mocked database)');
globalThis.fetch=async()=>Response.json('limited');check((await POST(request())).status===429,'database rate limit surfaces correctly (mocked database)');
globalThis.fetch=async()=>new Response('failure',{status:500});check((await POST(request())).status===502,'database failure never reports success');
globalThis.fetch=async()=>{throw new Error('offline')};check((await POST(request())).status===503,'network failure preserves error state');globalThis.fetch=originalFetch;
const {navigation,services,quoteLink}=await import('../.verification/content.js');for(const item of [...navigation,{href:'/contact'},{href:'/privacy'}])check(fs.existsSync('app'+(item.href==='/'?'':item.href)+'/page.tsx'),'route exists '+item.href);
for(const s of services)check(quoteLink(s.id)==='/contact?service='+s.id,'service CTA '+s.id);
for(const f of ['kaaba.webp','haram.webp','madinah.webp'])check(fs.statSync('public/images/'+f).size>0,'local image '+f);
console.log(`${checks} assertions passed. Browser and live Supabase tests are separate launch checks.`);
fs.rmSync(target,{recursive:true,force:true});
