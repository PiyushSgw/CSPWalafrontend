// Static content for the BcUnion.in landing page. Kept out of the components
// so the JSX stays small and readable.

export interface DocForm {
  code: string;
  title: string;
  desc: string;
}

export const DOC_FORMS: DocForm[] = [
  { code: 'FORM · 01', title: 'Account Opening Form', desc: 'BSBDA / Savings खाते उघडण्यासाठी संपूर्ण KYC अर्ज. बँकेच्या फॉरमॅटमध्ये तयार.' },
  { code: 'FORM · 02 · DA-1', title: 'Nomination Form (DA-1)', desc: 'वारसदार नोंदणीसाठी — AOF सोबत आपोआप माहिती भरून तयार होतो.' },
  { code: 'FORM · 03', title: 'FATCA Annexure', desc: 'FATCA / CRS घोषणापत्र — Tax Residency माहितीसह अचूक भरून तयार.' },
  { code: 'FORM · 04', title: 'Integrity Pledge', desc: 'नागरिक प्रामाणिकपणा शपथपत्र — खाते उघडण्यासोबत सादर करण्यासाठी.' },
  { code: 'FORM · 05', title: 'Debit Card Request', desc: 'नवीन ATM / RuPay Debit Card साठी अर्ज — खाते उघडतानाच सादर करा.' },
  { code: 'FORM · 06', title: 'AEPS Activation', desc: 'Aadhaar Enabled Payment System सक्रियकरण अर्ज — AEPS सेवांसाठी.' },
  { code: 'FORM · 07', title: 'Account Transfer', desc: 'शाखा हस्तांतरण — एका शाखेतून दुसऱ्या शाखेत खाते transfer.' },
  { code: 'FORM · 08', title: 'Other Services Request', desc: 'Cheque Book, Standing Instruction, मोबाईल नंबर बदल व इतर सेवा.' },
];

export interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
}

export const SERVICE_ITEMS: ServiceItem[] = [
  { icon: '🔒', title: 'Account Closure', desc: 'बँक खाते बंद करण्यासाठी विनंती अर्ज.' },
  { icon: '🔄', title: 'Account Status Change', desc: 'Flexi conversion, Dormant to Active, BSBDA to General, Minor to Major, Nomination change.' },
  { icon: '🏛️', title: 'Account Transfer / Closure', desc: 'एका शाखेतून दुसऱ्या शाखेत खाते transfer किंवा closure.' },
  { icon: '📡', title: 'Alternate Channels', desc: 'ATM/Debit Card, PIN, SMS Alerts, e-Statement, Ready Kit Debit Card activation.' },
  { icon: '💳', title: 'ATM Card Request', desc: 'नवीन किंवा Replacement ATM / Debit Card साठी अर्ज.' },
  { icon: '📜', title: 'Certificates & Statements', desc: 'Balance Certificate, TDS Certificate, Statement of Accounts विनंती.' },
  { icon: '📍', title: 'Change Address', desc: 'खात्यावरील communication पत्ता अद्यतन विनंती.' },
  { icon: '📗', title: 'Cheque Book Request', desc: 'नवीन Cheque Book साठी विनंती अर्ज.' },
  { icon: '📞', title: 'Contact Details Update', desc: 'Registered Mobile Number, Phone किंवा Email अद्यतन.' },
  { icon: '🪪', title: 'Identity Update', desc: 'PAN, Aadhaar, Passport, Driving Licence किंवा Occupation अद्यतन.' },
  { icon: '✏️', title: 'Name Modification', desc: 'खात्यावरील नावात Addition, Deletion किंवा Modification.' },
  { icon: '🔁', title: 'Standing Instruction', desc: 'Recurring transfers किंवा payments साठी Standing Instruction setup.' },
  { icon: '📊', title: 'Statement Request', desc: 'निर्धारित कालावधीसाठी Account Statement विनंती.' },
  { icon: '🚫', title: 'Stop Payment', desc: 'Cheque वर Stop Payment विनंती — बँकेला तात्काळ सादर.' },
];

export interface KycForm {
  code: string;
  title: string;
  desc: string;
}

export const KYC_FORMS: KycForm[] = [
  { code: 'KYC · 01', title: 'Aadhaar Seeding / Update', desc: 'खात्याशी Aadhaar Link करणे किंवा Aadhaar माहिती अद्यतन.' },
  { code: 'KYC · 02', title: 'PAN Update / Linking', desc: 'बँक खात्याशी PAN Card link करणे किंवा PAN माहिती सुधारणा.' },
  { code: 'KYC · 03', title: 'Address Update (KYC)', desc: 'नवीन पत्त्याचा पुरावा देऊन KYC अंतर्गत पत्ता बदल विनंती.' },
  { code: 'KYC · 04', title: 'Mobile Number Update', desc: 'Registered मोबाईल नंबर बदल — OTP व KYC verification सहित.' },
  { code: 'KYC · 05', title: 'Signature Update', desc: 'खात्यावरील नोंदणीकृत सही बदल विनंती — नवीन सही कार्डसह.' },
  { code: 'KYC · 06', title: 'Photo Update', desc: 'खात्यावरील फोटो अद्यतन — नवीन पासपोर्ट साईज फोटोसह.' },
  { code: 'KYC · 07', title: 'Re-KYC Form', desc: 'दर काही वर्षांनी आवश्यक असलेला Re-KYC अर्ज — सर्व बँकांसाठी.' },
  { code: 'KYC · 08', title: 'Aadhaar Consent (DBT)', desc: 'DBT / Non-DBT साठी Aadhaar Linking Consent Form.' },
  { code: 'KYC · 09', title: 'Occupation / Income Update', desc: 'व्यवसाय, उत्पन्न स्रोत किंवा Politically Exposed Person status अद्यतन.' },
];

export interface Step {
  num: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  { num: 'STEP 01', title: 'बँक निवडा', desc: '१२ राष्ट्रीयीकृत बँकांमधून तुमची बँक निवडा — फॉर्म्स आपोआप लोड होतात.' },
  { num: 'STEP 02', title: 'माहिती भरा', desc: 'ग्राहकाची माहिती एकदाच टाईप करा — AOF + Nomination + FATCA + Schemes एकत्र तयार.' },
  { num: 'STEP 03', title: 'प्रिंट घ्या', desc: 'अचूक, स्वच्छ, बँक-स्टँडर्ड फॉरमॅटमध्ये सर्व फॉर्म्स एकत्र प्रिंट करा.' },
  { num: 'STEP 04', title: 'सही-शिक्का व जमा', desc: 'फोटो लावा, सही-शिक्का मारा आणि थेट बँकेत जमा करा. संपूर्ण!' },
];

export interface WhyItem {
  icon: string;
  title: string;
  desc: string;
}

export const WHY_ITEMS: WhyItem[] = [
  { icon: '⚡', title: 'वेळ वाचतो', desc: 'हाताने फॉर्म भरण्याऐवजी 3 मिनिटांत सर्व फॉर्म्स तयार — दिवसात जास्त ग्राहकांना सेवा.' },
  { icon: '✅', title: 'चुका नाहीत', desc: 'डिजिटल भरणीमुळे खाडाखोड, चुकीचे लेखन शून्य — बँकेने फॉर्म नाकारण्याचा प्रश्न नाही.' },
  { icon: '🏛️', title: 'योजना बंडल', desc: 'APY · PMJJBY · PMSBY — खाते उघडतानाच एकत्र नावनोंदणी, ग्राहकाला तीन लाभ एकाच वेळी.' },
  { icon: '🏦', title: '१२ बँका', desc: 'सर्व प्रमुख सरकारी PSB बँकांचे फॉर्म्स एकाच पोर्टलवर — वेगळ्या टूल्सची गरज नाही.' },
  { icon: '📱', title: 'मोबाईलवर पण', desc: 'फोनवरून फॉर्म भरा, प्रिंट सुविधा — कुठूनही, केव्हाही काम करा.' },
  { icon: '🔒', title: 'सुरक्षित डेटा', desc: 'IT Act 2000 व DPDPA 2023 अनुपालन — ग्राहकाची माहिती पूर्णपणे सुरक्षित.' },
];

export interface PricingForm {
  icon: string;
  name: string;
  sub: string;
  price: string;
}

export const PAY_PER_FORM_ITEMS: PricingForm[] = [
  { icon: '📄', name: 'Account Opening Form (AOF)', sub: 'DA-1 + FATCA + Pledge सहित', price: '₹0.10' },
  { icon: '💸', name: 'RTGS / NEFT Form', sub: 'Fund transfer अर्ज', price: '₹0.10' },
  { icon: '💵', name: 'Cash Deposit Slip', sub: 'Denomination auto-calculate', price: '₹0.10' },
  { icon: '🧾', name: 'Cheque Deposit Slip', sub: 'Multiple cheques एका slip मध्ये', price: '₹0.10' },
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
    badge: 'APY', badgeClass: 'sc-apy', title: 'अटल पेन्शन योजना', full: 'Atal Pension Yojana',
    desc: 'असंघटित क्षेत्रातील कामगारांना निवृत्तीनंतर निश्चित मासिक पेन्शन. AOF सोबत एकत्र नावनोंदणी करा.',
    details: [
      { label: 'वयोमर्यादा', val: '18 – 40 वर्षे' },
      { label: 'पेन्शन रक्कम', val: '₹1,000 – ₹5,000/माह' },
      { label: 'सरकारी योगदान', val: '50% (पात्र असल्यास)' },
      { label: 'फॉर्म', val: 'APY-1 Subscriber Form' },
    ],
    tags: ['APY-1 Form', 'Auto-Debit Mandate', 'AOF बंडल'],
  },
  {
    badge: 'PMJJBY', badgeClass: 'sc-pmjjby', title: 'जीवन ज्योती विमा', full: 'PM Jeevan Jyoti Bima Yojana',
    desc: '₹2 लाख रुपयांचे जीवन विमा संरक्षण — कोणत्याही कारणाने मृत्यू झाल्यास कुटुंबाला लाभ.',
    details: [
      { label: 'वयोमर्यादा', val: '18 – 50 वर्षे' },
      { label: 'विमा रक्कम', val: '₹2,00,000' },
      { label: 'वार्षिक प्रीमियम', val: '₹436/वर्ष' },
      { label: 'नूतनीकरण', val: 'दर वर्षी 1 जून' },
    ],
    tags: ['PMJJBY Form', 'Auto-Debit', 'AOF बंडल'],
  },
  {
    badge: 'PMSBY', badgeClass: 'sc-pmsby', title: 'सुरक्षा विमा योजना', full: 'PM Suraksha Bima Yojana',
    desc: 'अपघाती मृत्यू किंवा अपंगत्वासाठी ₹2 लाख संरक्षण — फक्त ₹20/वर्ष या अत्यल्प प्रीमियममध्ये.',
    details: [
      { label: 'वयोमर्यादा', val: '18 – 70 वर्षे' },
      { label: 'विमा रक्कम', val: '₹2,00,000' },
      { label: 'वार्षिक प्रीमियम', val: 'फक्त ₹20/वर्ष' },
      { label: 'आंशिक अपंगत्व', val: '₹1,00,000' },
    ],
    tags: ['PMSBY Form', 'Auto-Debit', 'AOF बंडल'],
  },
];

export interface Bank {
  code: string;
  name: string;
  cls: string;
  selected?: boolean;
}

export const BANKS: Bank[] = [
  { code: 'UBI', name: 'Union Bank of India', cls: 'c-ubi', selected: true },
  { code: 'SBI', name: 'State Bank of India', cls: 'c-sbi' },
  { code: 'BOB', name: 'Bank of Baroda', cls: 'c-bob' },
  { code: 'BOM', name: 'Bank of Maharashtra', cls: 'c-bom' },
  { code: 'PNB', name: 'Punjab National Bank', cls: 'c-pnb' },
  { code: 'CAN', name: 'Canara Bank', cls: 'c-can' },
  { code: 'BOI', name: 'Bank of India', cls: 'c-boi' },
  { code: 'PSB', name: 'Punjab & Sind Bank', cls: 'c-psb' },
  { code: 'IOB', name: 'Indian Overseas Bank', cls: 'c-iob' },
  { code: 'CBI', name: 'Central Bank of India', cls: 'c-cbi' },
  { code: 'IND', name: 'Indian Bank', cls: 'c-ind' },
  { code: 'UCO', name: 'UCO Bank', cls: 'c-uco' },
];

export interface ComingSoonItem {
  icon: string;
  title: string;
  desc: string;
}

export const COMING_SOON_ITEMS: ComingSoonItem[] = [
  { icon: '📘', title: 'Passbook Printing', desc: '4×6 प्रीमियम पासबुक प्रिंट व बँक पासबुकवर थेट प्रिंटिंग — सर्व १२ बँकांसाठी.' },
  { icon: '💸', title: 'RTGS / NEFT Form', desc: 'Fund Transfer साठी RTGS व NEFT फॉर्म्स — 40+ बँकांसाठी ऑनलाइन भरा, प्रिंट घ्या.' },
  { icon: '💵', title: 'Cash Deposit Slip', desc: 'नोटांचे denomination आपोआप calculate होऊन प्रिंट-रेडी Cash Deposit Slip तयार.' },
  { icon: '🧾', title: 'Cheque Deposit Slip', desc: 'एकाच slip मध्ये multiple cheques — बँकेत सादर करण्यासाठी प्रिंट-रेडी.' },
  { icon: '✍️', title: 'Cheque Printing', desc: 'Cheque leaf वर थेट व्यावसायिक दर्जाची छपाई — Visual editor सहित.' },
  { icon: '📒', title: 'Saved Account Book', desc: 'ग्राहकाची माहिती save करा — पुढच्या वेळी Auto-Fill, वेळ आणखी वाचेल.' },
];

// Shared type for the callback that opens the slide-out auth panel.
export type OpenAuth = (tab: 'login' | 'register') => void;
