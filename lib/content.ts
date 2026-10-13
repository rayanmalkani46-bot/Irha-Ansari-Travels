export const business = {
  name: 'IRHA ANSARI TRAVELS', shortName: 'IRHA ANSARI', tagline: 'Umrah Visa Specialists',
  email: '', phone: '', whatsapp: '', address: '',
  managingDirector: 'Younus Malkani',
  experience: '11+ years of excellence in visa processing & travel services',
  servicePromise: 'We give more preference to service compared to price.',
  localSupport: 'Our staff in Makkah help coordinate transport and visa-related support.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://irha-ansari-travels.tarttulip64.chatgpt.site',
  privacy: 'We use your contact details and enquiry to respond to your agency’s request. Please do not include passport numbers, identity documents or sensitive traveller information.',
};
export const navigation = [{label:'Home',href:'/'},{label:'Visa Services',href:'/visa-services'},{label:'BRN & Ground Services',href:'/ground-services'},{label:'About Us',href:'/about'}];
export const services = [
 {id:'group',title:'Group Umrah Visa',short:'Group visas',icon:'users',description:'Group Umrah visa assistance, with or without BRN coordination where available. Clear updates for your agency.', detail:'Coordinate your group’s proposed journey with one structured enquiry. Ask about group visa services with or without BRN coordination. IRHA confirms the available option, eligibility and required arrangements before you proceed.',category:'visa'},
 {id:'individual',title:'Individual Umrah Visa',short:'Individual visas',icon:'passport',description:'Individual Umrah visa assistance, including hotel and catering BRN coordination when required and available.',detail:'Discuss individual Umrah visa assistance with or without BRN coordination, subject to the available service. Share your proposed onward and return travel plans; IRHA will confirm the relevant documentation and booking arrangements.',category:'visa'},
 {id:'long-stay',title:'Long-Stay / Iqama-Based Visa Assistance',short:'Long-stay assistance',icon:'file',description:'Discuss longer-stay or Iqama-related requirements with our team before proceeding.',detail:'Tell us the nature of your enquiry without sharing identity documents. This is an assistance enquiry, not a confirmed visa category or an eligibility determination. Availability, applicable route and permitted stay must be confirmed by IRHA.',category:'visa'},
 {id:'hotel',title:'Hotel BRN Coordination',short:'Hotel BRN',icon:'building',description:'Hotel-related booking reference coordination aligned with your proposed itinerary.',detail:'Share your preferred destination, travel dates and group size. We will discuss hotel coordination and the applicable booking reference requirements, subject to availability and confirmation.',category:'ground'},
 {id:'catering',title:'Catering BRN Coordination',short:'Catering BRN',icon:'dining',description:'Coordinate catering requirements and relevant booking references for your travellers.',detail:'Let us know your group size, proposed schedule and meal preferences. Catering arrangements and any relevant booking reference requirements are confirmed for your specific request.',category:'ground'},
 {id:'transport',title:'Transport Coordination',short:'Transport',icon:'bus',description:'Arrival and onward transport coordination, supported by our staff in Makkah.',detail:'Discuss arrival, departure and intercity transfers with our team, including coordination through our staff in Makkah. Ask about available 2026–2027 model buses; the assigned vehicle, route, inclusions and quotation must be confirmed for your dates.',category:'ground'},
] as const;
export const benefits = [
 ['Specialist visa assistance','A focused approach to Umrah visa enquiries and the needs of travel agents.'],
 ['Clear document coordination','Understand what is needed before preparing your clients’ applications.'],
 ['Makkah-based support','Our staff in Makkah help with transport coordination and visa-related support.'],
 ['Service comes first','We give more preference to service compared to price, with competitive B2B quotations tailored to your needs.'],
];
export const steps = [['Share your requirements','Tell us about your agency, service needs and proposed travel dates.'],['Receive a tailored quotation','We confirm service availability and share a relevant document checklist.'],['Submit the required documents','Once confirmed, use the secure submission method provided by our team.'],['Stay informed throughout','Receive application updates and travel coordination support.']];
export const faqs = [
 ['Who can request a B2B quotation?','Travel agents and travel businesses can enquire about services for their clients. Please include your agency name and the support you need.'],
 ['Can I enquire about group and individual visa services?','Yes. You can request assistance for either group or individual Umrah visa enquiries. Availability and eligibility are confirmed by IRHA for each request.'],
 ['How do I receive a document checklist?','Request requirements through the enquiry form. Our team will confirm the relevant checklist for your service and traveller circumstances. Please do not upload identity documents with your initial enquiry.'],
 ['Can hotel, catering and transport coordination be included?','Yes, you can discuss these services alongside your visa enquiry. Inclusions, availability and quotations are confirmed individually.'],
 ['How is processing time confirmed?','IRHA confirms the anticipated timeline after reviewing your requirements and current service availability. Timelines can vary; an enquiry or application does not guarantee approval.'],
];
export function quoteLink(id?:string){ return '/contact'+(id?'?service='+encodeURIComponent(id):''); }

// Previously supplied business checklists. These are editable and need current IRHA confirmation.
export const documentChecklists: Record<string, readonly string[]> = {
 group: ['Passport copy', 'Confirmed onward and return flight tickets', 'Complete journey schedule', 'Hotel BRN, where applicable to the confirmed service'],
 individual: ['Passport copy', 'Confirmed arrival and departure flight tickets', 'Hotel and catering booking references, where applicable'],
 'long-stay': ['Passport copy', 'Iqama copy', 'Saudi mobile number linked with the Saudi ID', 'Absher approval, if applicable to the confirmed process', 'PAN card copy, if required'],
};
export const checklistNotice = 'Previously supplied checklist — current requirements and eligibility must be confirmed by IRHA. This is not regulatory advice or approval confirmation. Do not send these documents through the initial enquiry form.';
