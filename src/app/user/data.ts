// Static content for the BcUnion.in landing page. Kept out of the components
// so the JSX stays small and readable.

export interface DocForm {
  code: string;
  title: string;
  desc: string;
}

export const DOC_FORMS: DocForm[] = [
  { code: 'FORM 01', title: 'Account Opening Form', desc: 'BSBDA / सेव्हिंग खाते उघडण्यासाठी संपूर्ण अर्ज, बँकेच्या फॉरमॅटप्रमाणे.' },
  { code: 'FORM 02 · DA-1', title: 'Nomination Form', desc: 'वारसदार नोंदणीसाठी DA-1 फॉर्म, आवश्यक तपशीलांसह आपोआप भरला जातो.' },
  { code: 'FORM 03', title: 'FATCA Annexure', desc: 'FATCA/CRS घोषणापत्र अचूक आणि पूर्ण भरलेलं तयार मिळेल.' },
  { code: 'FORM 04', title: 'Integrity Pledge', desc: 'नागरिकांसाठी प्रामाणिकपणाची शपथ — Integrity Pledge for Citizens फॉर्म.' },
  { code: 'FORM 05', title: 'Other Services Request', desc: 'उर्वरित बँक सेवांसाठी सर्वसाधारण विनंती अर्ज, एका क्लिकवर तयार.' },
  { code: 'FORM 06', title: 'Debit Card Request', desc: 'नवीन डेबिट कार्डसाठी अर्ज, ग्राहकाची माहिती आपोआप भरून तयार.' },
  { code: 'FORM 07', title: 'AEPS Activation Form', desc: 'AEPS सेवा सुरु करण्यासाठी सक्रियकरण अर्ज, बँक फॉरमॅटप्रमाणे.' },
  { code: 'FORM 08', title: 'Account Transfer Form', desc: 'खाते एका शाखेतून दुसऱ्या शाखेत हस्तांतरित करण्यासाठीचा अर्ज.' },
];

export interface Step {
  num: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  { num: 'STEP 01', title: 'माहिती भरा', desc: 'BcUnion.in वर लॉगिन करून ग्राहकाची माहिती एकदाच टाईप करा.' },
  { num: 'STEP 02', title: 'प्रिंट काढा', desc: 'सर्व फॉर्म्स/पासबुक रेडिमेड, अचूक स्वरूपात प्रिंट करा.' },
  { num: 'STEP 03', title: 'सही-शिक्का व जमा', desc: 'फोटो लावा, सही-शिक्का मारा आणि थेट बँकेत जमा करा.' },
];

export interface SchemeDetail { label: string; val: string; }
export interface Scheme {
  badge: string;
  badgeClass: string;
  title: string;
  full: string;
  desc: string;
  details: SchemeDetail[];
  tags: string[];
}

export const SCHEMES: Scheme[] = [
  {
    badge: 'APY', badgeClass: 'badge-apy', title: 'अटल पेन्शन योजना', full: 'Atal Pension Yojana',
    desc: 'असंघटित क्षेत्रातील कामगारांना निवृत्तीनंतर निश्चित मासिक पेन्शन मिळण्यासाठी केंद्र सरकारची योजना.',
    details: [
      { label: 'वयोमर्यादा', val: '18 – 40 वर्षे' },
      { label: 'पेन्शन रक्कम', val: '₹1,000 – ₹5,000/माह' },
      { label: 'सरकारी योगदान', val: '50% (पात्र असल्यास)' },
      { label: 'फॉर्म', val: 'APY-1 Subscriber Form' },
    ],
    tags: ['APY-1 Form', 'Mandate Form', 'AOF सोबत'],
  },
  {
    badge: 'PMJJBY', badgeClass: 'badge-pmjjby', title: 'जीवन ज्योती विमा', full: 'PM Jeevan Jyoti Bima Yojana',
    desc: '₹2 लाख रुपयांचे जीवन विमा संरक्षण, फक्त ₹436/वर्ष प्रीमियम — कोणत्याही कारणाने मृत्यू झाल्यास कुटुंबाला लाभ.',
    details: [
      { label: 'वयोमर्यादा', val: '18 – 50 वर्षे' },
      { label: 'विमा रक्कम', val: '₹2,00,000' },
      { label: 'वार्षिक प्रीमियम', val: '₹436/वर्ष' },
      { label: 'नूतनीकरण', val: 'दर वर्षी 1 जून' },
    ],
    tags: ['PMJJBY Form', 'Auto-Debit Mandate', 'AOF सोबत'],
  },
  {
    badge: 'PMSBY', badgeClass: 'badge-pmsby', title: 'सुरक्षा विमा योजना', full: 'PM Suraksha Bima Yojana',
    desc: 'अपघाती मृत्यू किंवा अपंगत्वासाठी ₹2 लाख संरक्षण — फक्त ₹20/वर्ष या अत्यल्प प्रीमियममध्ये.',
    details: [
      { label: 'वयोमर्यादा', val: '18 – 70 वर्षे' },
      { label: 'विमा रक्कम', val: '₹2,00,000' },
      { label: 'वार्षिक प्रीमियम', val: 'फक्त ₹20/वर्ष' },
      { label: 'आंशिक अपंगत्व', val: '₹1,00,000' },
    ],
    tags: ['PMSBY Form', 'Auto-Debit Mandate', 'AOF सोबत'],
  },
];
