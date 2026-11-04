export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  CLIENT: 'CLIENT',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const SERVICE_CATEGORIES = {
  MOU_AGREEMENTS: 'MOU_AGREEMENTS',
  LEGAL_DOCUMENTATION: 'LEGAL_DOCUMENTATION',
  PERMISSIONS_APPROVALS: 'PERMISSIONS_APPROVALS',
  LEGAL_COMPLIANCE: 'LEGAL_COMPLIANCE',
} as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[keyof typeof SERVICE_CATEGORIES];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, { label: string; description: string }> = {
  MOU_AGREEMENTS: {
    label: 'MOUs & Agreements',
    description: 'Drafting, negotiating, and reviewing legally binding MOUs, partnership deeds, and contracts.',
  },
  LEGAL_DOCUMENTATION: {
    label: 'Legal Documentation',
    description: 'Preparation, vetting, and standardization of commercial contracts and essential legal instruments.',
  },
  PERMISSIONS_APPROVALS: {
    label: 'Permissions & Approvals',
    description: 'End-to-end guidance and tracking for statutory licences, regulatory clearances, and governmental authorisations.',
  },
  LEGAL_COMPLIANCE: {
    label: 'Legal Compliance & Enforcement',
    description: 'Corporate governance, statutory filing deadlines, risk mitigation, and obligation enforcement.',
  },
};

export const REQUEST_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  IN_PROGRESS: 'IN_PROGRESS',
  AWAITING_CLIENT_INFO: 'AWAITING_CLIENT_INFO',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[keyof typeof REQUEST_STATUSES];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  SUBMITTED: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  AWAITING_CLIENT_INFO: { label: 'Awaiting Client Info', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  AWAITING_APPROVAL: { label: 'Awaiting Approval', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  REJECTED: { label: 'Rejected', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

export const AGREEMENT_STATUSES = {
  DRAFT: 'DRAFT',
  SENT_FOR_REVIEW: 'SENT_FOR_REVIEW',
  AWAITING_SIGNATURES: 'AWAITING_SIGNATURES',
  PARTIALLY_SIGNED: 'PARTIALLY_SIGNED',
  FULLY_SIGNED: 'FULLY_SIGNED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type AgreementStatus = (typeof AGREEMENT_STATUSES)[keyof typeof AGREEMENT_STATUSES];

export const AGREEMENT_STATUS_LABELS: Record<AgreementStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-neutral-700', bg: 'bg-neutral-100 border-neutral-300' },
  SENT_FOR_REVIEW: { label: 'Sent for Review', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  AWAITING_SIGNATURES: { label: 'Awaiting Signatures', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  PARTIALLY_SIGNED: { label: 'Partially Signed', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  FULLY_SIGNED: { label: 'Fully Signed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' },
  CANCELLED: { label: 'Cancelled', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

export const DOCUMENT_CATEGORIES = {
  CLIENT_UPLOAD: 'CLIENT_UPLOAD',
  LEGAL_DRAFT: 'LEGAL_DRAFT',
  FINAL_EXECUTED: 'FINAL_EXECUTED',
  APPROVAL_PERMIT: 'APPROVAL_PERMIT',
  COMPLIANCE_FILING: 'COMPLIANCE_FILING',
} as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[keyof typeof DOCUMENT_CATEGORIES];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  CLIENT_UPLOAD: 'Client Supporting Document',
  LEGAL_DRAFT: 'Legal Working Draft',
  FINAL_EXECUTED: 'Executed / Signed Agreement',
  APPROVAL_PERMIT: 'Official Licence / Permit',
  COMPLIANCE_FILING: 'Statutory Filing Receipt',
};

