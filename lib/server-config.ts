// Import from server components and route handlers only.
export function isConfigured(){return Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY&&process.env.ENQUIRY_RATE_LIMIT_SALT)}
