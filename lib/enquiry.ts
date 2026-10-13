import {z} from 'zod';
import {services} from './content';
export const enquirySchema=z.object({
 agency:z.string().trim().min(2,'Enter your agency name.').max(120),
 contact:z.string().trim().min(2,'Enter your contact name.').max(100),
 email:z.string().trim().email('Enter a valid email address.').max(254),
 phone:z.string().trim().regex(/^\+[1-9][\d ()-]{6,20}$/,'Include your country code, for example +91.').refine(s=>s.replace(/\D/g,'').length<=15,'Use no more than 15 digits.'),
 service:z.string().refine(s=>services.some(v=>v.id===s),'Choose a service.'),
 travellers:z.coerce.number().int().min(1,'Enter at least 1 traveller.').max(10000),
 travelDate:z.string().refine(s=>s===''||(/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s&&s>=new Date().toISOString().slice(0,10)),'Choose a valid date today or later.'),
 message:z.string().trim().max(3000,'Keep your message under 3,000 characters.'),
 website:z.string().max(0),
});
export type Enquiry= z.infer<typeof enquirySchema>;
