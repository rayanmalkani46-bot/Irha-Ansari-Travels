// Run with Node 22+: node --env-file=.env.local scripts/check-backend.mjs
// Read-only readiness check: never creates an enquiry or prints credentials.
const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','ENQUIRY_RATE_LIMIT_SALT'];
const missing=required.filter(key=>!process.env[key]);
if(missing.length){console.error('Missing configuration: '+missing.join(', '));process.exit(1)}
try{
 const response=await fetch(process.env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/rpc/enquiry_health',{
  method:'POST',headers:{'Content-Type':'application/json',apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY},body:'{}',signal:AbortSignal.timeout(10000)
 });
 if(!response.ok||await response.json()!=='ready'){console.error('Backend not ready. Verify the project URL, server key and both SQL migrations.');process.exit(1)}
 console.log('Backend connected; enquiry schema and submission function are present. Next: submit a test enquiry and verify anonymous access is denied.');
}catch{console.error('Cannot connect to the backend. Check network access and the project URL.');process.exit(1)}
