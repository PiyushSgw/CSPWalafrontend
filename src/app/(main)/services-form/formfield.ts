/**
 * SRF-1 Service Request Form - Field Configuration
 * All fields from Union Bank Service Request Form mapped to form data structure
 */

export const FORM_SECTIONS = {
  CUSTOMER_INFO: 'Customer Information',
  ADDRESS: 'Change of Address',
  CONTACT: 'Contact Details',
  IDENTITY: 'Identity Details',
  CERTIFICATES: 'Certificates/Statements',
  CHANNELS: 'Alternate Channels',
  CHEQUE: 'Cheque Book',
  STANDING: 'Standing Instructions',
  NAME_CHANGE: 'Name Addition/Deletion/Modification',
  STOP_PAYMENT: 'Stop Payment',
  DD_CANCEL: 'DD/Pay Order Cancellation',
  ACCOUNT_STATUS: 'Account Status Change',
  TRANSFER_CLOSURE: 'Transfer/Closure',
} as const;

export type FormSection = (typeof FORM_SECTIONS)[keyof typeof FORM_SECTIONS];

export type FieldType =
  | 'text'
  | 'tel'
  | 'email'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox';

/**
 * Shared shape for every entry in FORM_FIELDS. Every variable bit
 * (options, pattern, required, placeholder, service, checkbox) is
 * declared here as optional so that consuming code (e.g. Phase2FormFields)
 * can access `field.options`, `field.pattern`, etc. on ANY field without
 * a "Property does not exist on type ..." error.
 */
export interface FieldConfig {
  label: string;
  hindi: string;
  /** key under which this field's value is stored in formData */
  field: string;
  type: FieldType;
  section: FormSection;
  placeholder?: string;
  required?: boolean;
  /** regex pattern for validation, e.g. '^[0-9]{6}$' */
  pattern?: string;
  /** options for type: 'select' */
  options?: string[];
  /** which "service" checkbox this field belongs to (sections 5-13) */
  service?: string;
  /** true if this field itself represents a service request checkbox */
  checkbox?: boolean;
}

export const FORM_FIELDS: Record<string, FieldConfig> = {
  // Section 1: Customer Information
  accountNumber: {
    label: 'Account Number',
    hindi: 'खाते क्र.',
    field: 'account_number',
    type: 'text',
    section: FORM_SECTIONS.CUSTOMER_INFO,
    placeholder: 'Enter account number',
  },

  // Customer Name Fields
  title: {
    label: 'Title',
    hindi: 'शीर्षक',
    field: 'title',
    type: 'select',
    section: FORM_SECTIONS.CUSTOMER_INFO,
    options: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'],
  },
  firstName: {
    label: 'First Name',
    hindi: 'पहिले नाव',
    field: 'first_name',
    type: 'text',
    section: FORM_SECTIONS.CUSTOMER_INFO,
    required: true,
  },
  middleName: {
    label: 'Middle Name',
    hindi: 'मधले नाव',
    field: 'middle_name',
    type: 'text',
    section: FORM_SECTIONS.CUSTOMER_INFO,
  },
  lastName: {
    label: 'Last Name',
    hindi: 'आडनाव',
    field: 'last_name',
    type: 'text',
    section: FORM_SECTIONS.CUSTOMER_INFO,
    required: true,
  },

  // Section 2: Address Change
  communicationAddress: {
    label: 'Communication/Local/Residence Address',
    hindi: 'संपर्क/स्थानिक/निवास पत्ता',
    field: 'address_line1',
    type: 'textarea',
    section: FORM_SECTIONS.ADDRESS,
  },
  permanentAddress: {
    label: 'Permanent Address',
    hindi: 'कायमचा पत्ता',
    field: 'permanent_address',
    type: 'textarea',
    section: FORM_SECTIONS.ADDRESS,
  },
  officeAddress: {
    label: 'Office Address',
    hindi: 'कार्यालयाचा पत्ता',
    field: 'office_address',
    type: 'textarea',
    section: FORM_SECTIONS.ADDRESS,
  },
  city: {
    label: 'City/District',
    hindi: 'शहर/जिल्हा',
    field: 'city',
    type: 'text',
    section: FORM_SECTIONS.ADDRESS,
    required: true,
  },
  state: {
    label: 'State',
    hindi: 'राज्य',
    field: 'state',
    type: 'text',
    section: FORM_SECTIONS.ADDRESS,
    required: true,
  },
  pinCode: {
    label: 'Pin Code',
    hindi: 'पिन',
    field: 'pin',
    type: 'text',
    section: FORM_SECTIONS.ADDRESS,
    pattern: '^[0-9]{6}$',
    placeholder: '000000',
  },
  phoneNumber: {
    label: 'Phone Number',
    hindi: 'दूरध्वनी क्रमांक',
    field: 'phone',
    type: 'tel',
    section: FORM_SECTIONS.ADDRESS,
  },
  mobileNumber: {
    label: 'Mobile Number',
    hindi: 'भ्रमणध्वनी',
    field: 'mobile',
    type: 'tel',
    section: FORM_SECTIONS.ADDRESS,
    required: true,
    pattern: '^[0-9]{10}$',
  },
  emailAddress: {
    label: 'E-Mail ID',
    hindi: 'ई-मेल आयडी',
    field: 'email',
    type: 'email',
    section: FORM_SECTIONS.ADDRESS,
    required: true,
  },

  // Section 3: Contact Details
  newEmail: {
    label: 'New Email ID',
    hindi: 'ई-मेल आयडी',
    field: 'contact_email',
    type: 'email',
    section: FORM_SECTIONS.CONTACT,
  },
  newMobile: {
    label: 'New Mobile Number',
    hindi: 'भ्रमणध्वनी क्रमांक',
    field: 'contact_mobile',
    type: 'tel',
    section: FORM_SECTIONS.CONTACT,
  },

  // Section 4: Identity Details
  occupation: {
    label: 'Occupation',
    hindi: 'व्यवसाय',
    field: 'occupation',
    type: 'text',
    section: FORM_SECTIONS.IDENTITY,
  },
  occupationCode: {
    label: 'Occupation Code',
    hindi: 'कोड',
    field: 'occupation_code',
    type: 'text',
    section: FORM_SECTIONS.IDENTITY,
  },
  panCard: {
    label: 'PAN Card',
    hindi: 'पॅन कार्ड',
    field: 'pan',
    type: 'text',
    section: FORM_SECTIONS.IDENTITY,
    pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
    placeholder: 'AAAAA0000A',
  },
  dateOfBirth: {
    label: 'Date of Birth',
    hindi: 'जन्म दिनांक',
    field: 'dob',
    type: 'date',
    section: FORM_SECTIONS.IDENTITY,
  },
  aadhaarCard: {
    label: 'Aadhar Card Number',
    hindi: 'आधार कार्ड क्रमांक',
    field: 'aadhaar',
    type: 'text',
    section: FORM_SECTIONS.IDENTITY,
    pattern: '^[0-9]{12}$',
    placeholder: '000000000000',
  },
  passportExpiry: {
    label: 'Passport Expiry Date',
    hindi: 'पारपत्र कालबाह्यता दिनांक',
    field: 'passport_expiry',
    type: 'date',
    section: FORM_SECTIONS.IDENTITY,
  },
  drivingLicenseExpiry: {
    label: 'Driving Licence Expiry Date',
    hindi: 'वाहन चालविण्याचा परवाना कालबाह्यता दिनांक',
    field: 'driving_license_expiry',
    type: 'date',
    section: FORM_SECTIONS.IDENTITY,
  },

  // Section 5: Certificates/Statements
  balanceCertificateDate: {
    label: 'Balance Certificate As On',
    hindi: 'या रोजीपर्यंतचे शिल्लक प्रमाणपत्र',
    field: 'balance_cert_date',
    type: 'date',
    section: FORM_SECTIONS.CERTIFICATES,
    service: 'balance_certificate',
    checkbox: true,
  },
  chequePaidCertificate: {
    label: 'Cheque Paid Certificate for Cheque No',
    hindi: 'धनादेश भरलेले प्रमाणपत्र',
    field: 'cheque_number',
    type: 'text',
    section: FORM_SECTIONS.CERTIFICATES,
    service: 'cheque_paid_cert',
    checkbox: true,
  },
  tdsCertificate: {
    label: 'TDS Certificate',
    hindi: 'टीडीएस प्रमाणपत्र',
    field: 'tds_certificate',
    type: 'checkbox',
    section: FORM_SECTIONS.CERTIFICATES,
    service: 'tds_certificate',
  },
  interestCertificate: {
    label: 'Interest Certificate',
    hindi: 'व्याज प्रमाणपत्र',
    field: 'interest_certificate',
    type: 'checkbox',
    section: FORM_SECTIONS.CERTIFICATES,
    service: 'interest_certificate',
  },
  statementOfAccounts: {
    label: 'Statement of Accounts',
    hindi: 'लेखा विवरण',
    field: 'statement_of_accounts',
    type: 'checkbox',
    section: FORM_SECTIONS.CERTIFICATES,
    service: 'statement_of_accounts',
  },
  duplicatePassbook: {
    label: 'Duplicate Pass Book',
    hindi: 'ग्राहक पुस्तिकेची प्रतीलिपी',
    field: 'duplicate_passbook',
    type: 'checkbox',
    section: FORM_SECTIONS.CERTIFICATES,
    service: 'duplicate_passbook',
  },

  // Section 6: Alternate Channels
  atmDebitCard: {
    label: 'ATM/Debit Card',
    hindi: 'एटीएम/डेबिट कार्ड',
    field: 'atm_debit_card',
    type: 'checkbox',
    section: FORM_SECTIONS.CHANNELS,
    service: 'atm_debit_card',
  },
  atmPin: {
    label: 'ATM Pin',
    hindi: 'एटीएम पिन',
    field: 'atm_pin',
    type: 'checkbox',
    section: FORM_SECTIONS.CHANNELS,
    service: 'atm_pin',
  },
  smsAlerts: {
    label: 'SMS Alerts',
    hindi: 'एसएमएस अलर्ट',
    field: 'sms_alerts',
    type: 'checkbox',
    section: FORM_SECTIONS.CHANNELS,
    service: 'sms_alerts',
  },
  eStatement: {
    label: 'e-Statement',
    hindi: 'ई-स्टेटमेंट',
    field: 'e_statement',
    type: 'checkbox',
    section: FORM_SECTIONS.CHANNELS,
    service: 'e_statement',
  },
  duplicateCard: {
    label: 'Duplicate ATM/Debit Card',
    hindi: 'डुप्लिकेट एटीएम/डेबिट कार्ड',
    field: 'duplicate_card',
    type: 'checkbox',
    section: FORM_SECTIONS.CHANNELS,
    service: 'duplicate_card',
  },
  oldCardNumber: {
    label: 'Old Card Number',
    hindi: 'जुने कार्ड क्रमांक',
    field: 'old_card_number',
    type: 'text',
    section: FORM_SECTIONS.CHANNELS,
  },

  // Section 7: Cheque Book
  savingsAccountCheques: {
    label: 'Savings Account Cheque Books (20 leaves each)',
    hindi: 'बचत खात्यासाठी धनादेश पुस्तके (प्रत्येकी 20 पत्रके)',
    field: 'savings_cheque_books',
    type: 'number',
    section: FORM_SECTIONS.CHEQUE,
  },
  currentAccountCheques: {
    label: 'Current Account Cheque Books (50/100 leaves each)',
    hindi: 'चालू खात्यासाठी धनादेश पुस्तके (५०/१०० पत्रके)',
    field: 'current_cheque_books',
    type: 'number',
    section: FORM_SECTIONS.CHEQUE,
  },

  // Section 8: Standing Instructions
  transferAmount: {
    label: 'Transfer Amount (₹)',
    hindi: 'हस्तांतरीत रक्कम (₹)',
    field: 'transfer_amount',
    type: 'number',
    section: FORM_SECTIONS.STANDING,
  },
  transferToAccount: {
    label: 'Transfer to Account Number',
    hindi: 'हस्तांतरीत खाता क्रमांक',
    field: 'transfer_account_number',
    type: 'text',
    section: FORM_SECTIONS.STANDING,
  },
  transferFrequency: {
    label: 'Transfer Frequency',
    hindi: 'हस्तांतरण वारंवारता',
    field: 'transfer_frequency',
    type: 'select',
    section: FORM_SECTIONS.STANDING,
    options: ['Monthly', 'Quarterly'],
  },
  transferStartDate: {
    label: 'Transfer Start Date',
    hindi: 'हस्तांतरण प्रारंभ दिनांक',
    field: 'transfer_start_date',
    type: 'date',
    section: FORM_SECTIONS.STANDING,
  },
  transferEndDate: {
    label: 'Transfer End Date',
    hindi: 'हस्तांतरण समाप्ति दिनांक',
    field: 'transfer_end_date',
    type: 'date',
    section: FORM_SECTIONS.STANDING,
  },

  // Section 9: Stop Payment
  stopPaymentFrom: {
    label: 'Stop Payment From Cheque No',
    hindi: 'धनादेश नंबरपासून रक्कम देऊ नका',
    field: 'stop_payment_from',
    type: 'text',
    section: FORM_SECTIONS.STOP_PAYMENT,
  },
  stopPaymentTo: {
    label: 'Stop Payment To Cheque No',
    hindi: 'धनादेश नंबरपर्यंत रक्कम देऊ नका',
    field: 'stop_payment_to',
    type: 'text',
    section: FORM_SECTIONS.STOP_PAYMENT,
  },
  stopPaymentDate: {
    label: 'Cheque Dated',
    hindi: 'दिनांकित',
    field: 'stop_payment_date',
    type: 'date',
    section: FORM_SECTIONS.STOP_PAYMENT,
  },
  stopPaymentAmount: {
    label: 'Stop Payment Amount (₹)',
    hindi: 'रक्कम (₹)',
    field: 'stop_payment_amount',
    type: 'number',
    section: FORM_SECTIONS.STOP_PAYMENT,
  },
  stopPaymentFavoring: {
    label: 'Cheque Favoring',
    hindi: 'धनादेश यांच्या नावे',
    field: 'stop_payment_favoring',
    type: 'text',
    section: FORM_SECTIONS.STOP_PAYMENT,
  },
  stopPaymentReason: {
    label: 'Reason for Stop Payment',
    hindi: 'कारण',
    field: 'stop_payment_reason',
    type: 'textarea',
    section: FORM_SECTIONS.STOP_PAYMENT,
  },
};

// Derived union of every `field` key used above - handy for typing
// the formData object in the Redux slice as Record<FormDataField, ...>.
export type FormDataField = (typeof FORM_FIELDS)[keyof typeof FORM_FIELDS]['field'];

// Bank list
export const BANKS_LIST = [
  { id: 1, name: 'Union Bank of India', code: 'UBI' },
  { id: 2, name: 'State Bank of India', code: 'SBI' },
  { id: 3, name: 'HDFC Bank', code: 'HDFC' },
  { id: 4, name: 'ICICI Bank', code: 'ICICI' },
];

// Account types
export const ACCOUNT_TYPES = [
  { label: 'Savings Account', value: 'SA' },
  { label: 'Current Account', value: 'CA' },
  { label: 'Salary Account', value: 'SALARY' },
  { label: 'NRI Account', value: 'NRI' },
  { label: 'Senior Citizen Account', value: 'SC' },
];

// Dispatch options
export const DISPATCH_OPTIONS = [
  { label: 'Collect from Branch', value: 'collect' },
  { label: 'Dispatch to Address', value: 'dispatch' },
];