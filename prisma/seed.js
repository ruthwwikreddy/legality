const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LEGALITY database...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.complianceTask.deleteMany();
  await prisma.complianceRecord.deleteMany();
  await prisma.agreementSignature.deleteMany();
  await prisma.agreementParty.deleteMany();
  await prisma.agreement.deleteMany();
  await prisma.agreementTemplate.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.document.deleteMany();
  await prisma.internalNote.deleteMany();
  await prisma.requestUpdate.deleteMany();
  await prisma.requestAssignment.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  const clientPasswordHash = await bcrypt.hash('Client@123456', 10);

  // 1. Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@legality.in',
      passwordHash,
      role: 'ADMIN',
      fullName: 'Vikramaditya Singhania',
      phone: '+91 98110 12345',
      employeeProfile: {
        create: {
          designation: 'Managing Partner & Administrator',
          department: 'Executive Legal Administration',
          barCouncilNumber: 'D/1234/2008',
          phone: '+91 98110 12345',
        },
      },
    },
  });

  // 2. Legal Team Members
  const counsel = await prisma.user.create({
    data: {
      email: 'counsel@legality.in',
      passwordHash,
      role: 'EMPLOYEE',
      fullName: 'Adv. Ananya Deshmukh',
      phone: '+91 98220 54321',
      employeeProfile: {
        create: {
          designation: 'Senior Legal Counsel',
          department: 'Corporate Transactions & MOUs',
          barCouncilNumber: 'MH/4582/2014',
          phone: '+91 98220 54321',
        },
      },
    },
  });

  const associate = await prisma.user.create({
    data: {
      email: 'associate@legality.in',
      passwordHash,
      role: 'EMPLOYEE',
      fullName: 'Rohan Mehra',
      phone: '+91 97110 98765',
      employeeProfile: {
        create: {
          designation: 'Regulatory & Compliance Associate',
          department: 'Statutory Permissions & Compliance',
          barCouncilNumber: 'D/8921/2021',
          phone: '+91 97110 98765',
        },
      },
    },
  });

  // 3. Client Users
  const clientTechCorp = await prisma.user.create({
    data: {
      email: 'client@techcorp.in',
      passwordHash: clientPasswordHash,
      role: 'CLIENT',
      fullName: 'Rajesh Sharma',
      phone: '+91 99880 11223',
      clientProfile: {
        create: {
          organizationName: 'TechCorp Solutions Private Limited',
          businessType: 'Private Limited Company',
          address: '4th Floor, Cyber Tech Park, Indiranagar, Bengaluru, Karnataka 560038',
          taxId: '29ABCDE1234F1Z5',
          industry: 'Software & Information Technology',
          notes: 'High-growth B2B enterprise software provider expanding to APAC.',
        },
      },
    },
  });

  const clientInnovate = await prisma.user.create({
    data: {
      email: 'client@innovate.in',
      passwordHash: clientPasswordHash,
      role: 'CLIENT',
      fullName: 'Dr. Priya Nambiar',
      phone: '+91 98450 67890',
      clientProfile: {
        create: {
          organizationName: 'Innovate BioLabs LLP',
          businessType: 'Limited Liability Partnership',
          address: 'Plot 12, Genome Valley, Shamirpet, Hyderabad, Telangana 500078',
          taxId: '36AAACI9876E1ZT',
          industry: 'Biotechnology & Diagnostics',
          notes: 'Seeking environmental clearance and proprietary licensing agreements.',
        },
      },
    },
  });

  // 4. Agreement Templates
  const templateNDA = await prisma.agreementTemplate.create({
    data: {
      title: 'Mutual Non-Disclosure Agreement (NDA)',
      category: 'MOU_AGREEMENTS',
      description: 'Standard bilateral non-disclosure agreement to protect trade secrets, financial records, and confidential IP.',
      defaultContent: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is made effective as of the execution date by and between the Participating Parties identified herein.

1. PURPOSE
The Parties wish to explore a potential business relationship and, in connection therewith, may disclose to each other proprietary and confidential information.

2. CONFIDENTIAL INFORMATION
"Confidential Information" shall include all non-public technical, business, financial, operational, and customer information disclosed by one party ("Disclosing Party") to the other ("Receiving Party"), whether orally, visually, or in tangible documentary or electronic form.

3. NON-DISCLOSURE AND RESTRICTED USE
The Receiving Party agrees:
a) To hold the Disclosing Party's Confidential Information in strict confidence using the same degree of care it uses for its own confidential information, but in no event less than reasonable care.
b) Not to use the Confidential Information for any purpose outside the scope of this Agreement without prior written consent.
c) Not to disclose Confidential Information to any third party, except to its employees, legal counsel, and financial advisors on a need-to-know basis.

4. TERM AND GOVERNING LAW
The obligations of confidentiality shall survive for a period of two (2) years from the date of disclosure. This Agreement shall be governed by and construed in accordance with the laws of India, and courts of competent jurisdiction shall have exclusive jurisdiction.

5. EXECUTION BY ELECTRONIC MEANS
In accordance with Section 10A of the Information Technology Act, 2000, this Agreement may be executed in counterparts and delivered electronically via secure digital signing workflow.`,
    },
  });

  const templateMOU = await prisma.agreementTemplate.create({
    data: {
      title: 'Strategic Partnership Memorandum of Understanding',
      category: 'MOU_AGREEMENTS',
      description: 'Comprehensive framework memorandum establishing joint venture objectives, milestone timelines, and IP ownership.',
      defaultContent: `MEMORANDUM OF UNDERSTANDING (MOU)

FOR STRATEGIC BUSINESS CO-OPERATION AND JOINT SERVICE PROVISION

This Memorandum of Understanding ("MOU") records the mutual understanding between the signatories regarding collaborative ventures.

1. OBJECTIVES AND RECITALS
The Parties desire to pool their respective domain expertise, technical capabilities, and operational infrastructure to deliver integrated commercial solutions.

2. ROLES & RESPONSIBILITIES
a) Party A shall provide technical architecture, platform engineering, and statutory product compliance.
b) Party B shall lead client acquisition, market distribution, relationship management, and regulatory coordination.

3. INTELLECTUAL PROPERTY RIGHTS
All pre-existing intellectual property shall remain the exclusive property of the originating party. Any newly developed joint work shall be co-owned in equal halves unless agreed otherwise in writing.

4. NON-BINDING NATURE & DEFINITIVE CONTRACTS
Except for clauses regarding Confidentiality, Non-Solicitation, and Dispute Resolution, this MOU sets forth intent and shall be followed by formal definitive agreements within ninety (90) days.

5. JURISDICTION
This MOU is subject to the arbitration framework governed by the Arbitration and Conciliation Act, 1996 of India.`,
    },
  });

  const templateMSA = await prisma.agreementTemplate.create({
    data: {
      title: 'Master Services Agreement (MSA)',
      category: 'LEGAL_DOCUMENTATION',
      description: 'Enterprise commercial contract governing recurring IT, professional services, SLAs, and liability terms.',
      defaultContent: `MASTER SERVICES AGREEMENT (MSA)

This Master Services Agreement governs the provision of professional legal and consulting services.

1. SCOPE OF SERVICES
The Provider will provide deliverables and professional services as outlined in individual Statements of Work ("SOW") executed from time to time.

2. FEES AND PAYMENT TERMS
Client shall remit payment within thirty (30) days from the invoice issuance date. Delayed payments shall attract interest at 1.5% per month or the statutory maximum rate.

3. WARRANTIES AND LIMITATION OF LIABILITY
Neither party shall be liable for indirect, incidental, or consequential damages. Maximum aggregate liability under this agreement shall not exceed total fees paid over the preceding 12 months.

4. TERMINATION
Either party may terminate this agreement without cause upon thirty (30) days written notice, or immediately for material breach uncured within fifteen (15) days.`,
    },
  });

  // 5. Service Requests
  const req1 = await prisma.serviceRequest.create({
    data: {
      trackingNumber: 'LEG-2026-1001',
      clientId: clientTechCorp.id,
      category: 'MOU_AGREEMENTS',
      title: 'Series-A Investor Term Sheet & Shareholders MOU',
      description: 'Drafting and vetting of a binding MOU and terms sheet with Vertex Capital for an upcoming Series-A financing round of $3.5M.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dynamicData: JSON.stringify({
        dealSize: '$3,500,000 USD',
        counterparty: 'Vertex Ventures Asia IV',
        jurisdiction: 'Bengaluru / Singapore',
        targetClosingDate: '2026-12-15',
      }),
      estimatedCompletion: new Date(Date.now() + 7 * 86400000),
      assignments: {
        create: {
          employeeId: counsel.id,
          role: 'PRIMARY_COUNSEL',
        },
      },
      updates: {
        createMany: {
          data: [
            {
              authorId: counsel.id,
              status: 'UNDER_REVIEW',
              message: 'Initial draft of term sheet clauses received from TechCorp. Commenced clause-by-clause legal review.',
              isPublicToClient: true,
            },
            {
              authorId: counsel.id,
              status: 'IN_PROGRESS',
              message: 'Identified critical liquidation preference and anti-dilution nuances. Redrafted protective covenants in favour of founders.',
              isPublicToClient: true,
            },
          ],
        },
      },
      internalNotes: {
        create: {
          authorId: counsel.id,
          content: 'Founder Rajesh Sharma requested stronger board veto thresholds. Make sure reserved matters list includes debt financing over INR 5 Cr.',
        },
      },
    },
  });

  const req2 = await prisma.serviceRequest.create({
    data: {
      trackingNumber: 'LEG-2026-1002',
      clientId: clientTechCorp.id,
      category: 'LEGAL_DOCUMENTATION',
      title: 'Enterprise SaaS Terms of Service & DPA (GDPR/DPDP)',
      description: 'Comprehensive preparation of Terms of Service, Privacy Policy, and Data Processing Addendum conforming with India DPDP Act 2023.',
      priority: 'MEDIUM',
      status: 'AWAITING_CLIENT_INFO',
      dynamicData: JSON.stringify({
        productName: 'CloudMatrix Enterprise',
        dataTypes: ['User telemetry', 'Employee PII', 'Payment tokens via Razorpay'],
        targetRegions: ['India', 'EU', 'US'],
      }),
      assignments: {
        create: {
          employeeId: associate.id,
          role: 'ASSOCIATE',
        },
      },
      updates: {
        create: {
          authorId: associate.id,
          status: 'AWAITING_CLIENT_INFO',
          message: 'Please provide the list of third-party sub-processors currently storing customer data (AWS regions, analytics tools, etc.).',
          isPublicToClient: true,
        },
      },
    },
  });

  const req3 = await prisma.serviceRequest.create({
    data: {
      trackingNumber: 'LEG-2026-1003',
      clientId: clientInnovate.id,
      category: 'PERMISSIONS_APPROVALS',
      title: 'Pollution Control Board Consent to Establish (CTE) & Factory Licence',
      description: 'Assistance with Telangana State Pollution Control Board (TSPCB) Orange Category environmental clearance and Department of Factories licence.',
      priority: 'URGENT',
      status: 'UNDER_REVIEW',
      dynamicData: JSON.stringify({
        plantLocation: 'Genome Valley, Shamirpet, Hyderabad',
        pollutionCategory: 'Orange Category - Bio-pharmaceutical research',
        powerRequirement: '250 KVA',
        waterConsumption: '5000 Litres/Day',
        effluentTreatment: 'Zero Liquid Discharge (ZLD) plant proposed',
      }),
      estimatedCompletion: new Date(Date.now() + 14 * 86400000),
      assignments: {
        create: {
          employeeId: associate.id,
          role: 'PRIMARY_COUNSEL',
        },
      },
      updates: {
        create: {
          authorId: associate.id,
          status: 'UNDER_REVIEW',
          message: 'Reviewing environmental impact assessment and site layout drawings submitted by Innovate BioLabs.',
          isPublicToClient: true,
        },
      },
    },
  });

  const req4 = await prisma.serviceRequest.create({
    data: {
      trackingNumber: 'LEG-2026-1004',
      clientId: clientInnovate.id,
      category: 'LEGAL_COMPLIANCE',
      title: 'Annual ROC Secretarial Compliance & Board Governance Filing',
      description: 'Mandatory annual LLP Form 11 (Annual Return) and Form 8 (Statement of Account & Solvency) filing with Ministry of Corporate Affairs (MCA).',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dynamicData: JSON.stringify({
        financialYear: '2025-2026',
        filingAuthority: 'MCA / ROC Hyderabad',
        statutoryAuditCompleted: true,
      }),
      estimatedCompletion: new Date(Date.now() + 20 * 86400000),
      assignments: {
        create: {
          employeeId: counsel.id,
          role: 'PRIMARY_COUNSEL',
        },
      },
      updates: {
        create: {
          authorId: counsel.id,
          status: 'IN_PROGRESS',
          message: 'Drafted Partner Resolution and designated partners disclosure. Awaiting final signed auditor certificate.',
          isPublicToClient: true,
        },
      },
    },
  });

  // 6. Documents
  await prisma.document.create({
    data: {
      title: 'TechCorp Certificate of Incorporation & MoA',
      fileName: 'TechCorp_Incorporation_MoA.pdf',
      fileType: 'application/pdf',
      fileSize: 1048576,
      filePath: '/uploads/TechCorp_Incorporation_MoA.pdf',
      category: 'CLIENT_UPLOAD',
      isClientVisible: true,
      clientId: clientTechCorp.id,
      requestId: req1.id,
      uploadedById: clientTechCorp.id,
      versions: {
        create: {
          versionNumber: 1,
          fileName: 'TechCorp_Incorporation_MoA.pdf',
          filePath: '/uploads/TechCorp_Incorporation_MoA.pdf',
          fileSize: 1048576,
          changeLog: 'Initial upload by client for investor vetting.',
        },
      },
    },
  });

  await prisma.document.create({
    data: {
      title: 'Investor Rights Agreement - Clean Working Draft v1.2',
      fileName: 'TechCorp_IRA_Working_Draft_v1.2.pdf',
      fileType: 'application/pdf',
      fileSize: 2097152,
      filePath: '/uploads/TechCorp_IRA_Working_Draft_v1.2.pdf',
      category: 'LEGAL_DRAFT',
      isClientVisible: true,
      clientId: clientTechCorp.id,
      requestId: req1.id,
      uploadedById: counsel.id,
      versions: {
        create: {
          versionNumber: 1,
          fileName: 'TechCorp_IRA_Working_Draft_v1.2.pdf',
          filePath: '/uploads/TechCorp_IRA_Working_Draft_v1.2.pdf',
          fileSize: 2097152,
          changeLog: 'Uploaded by Senior Counsel Ananya Deshmukh with marked-up minority protection covenants.',
        },
      },
    },
  });

  // 7. Active Agreements with Signers
  const shareToken1 = crypto.randomBytes(24).toString('hex');
  const viewTokenPartyA = crypto.randomBytes(24).toString('hex');
  const viewTokenPartyB = crypto.randomBytes(24).toString('hex');

  const agreement1 = await prisma.agreement.create({
    data: {
      trackingNumber: 'AGR-2026-0001',
      templateId: templateNDA.id,
      title: 'Mutual Non-Disclosure Agreement - TechCorp & Vertex Ventures',
      category: 'MOU_AGREEMENTS',
      status: 'AWAITING_SIGNATURES',
      content: templateNDA.defaultContent,
      effectiveDate: new Date(),
      secureShareToken: shareToken1,
      createdById: counsel.id,
      parties: {
        create: [
          {
            name: 'Rajesh Sharma',
            email: 'client@techcorp.in',
            phone: '+91 99880 11223',
            organization: 'TechCorp Solutions Private Limited',
            designation: 'Managing Director & CEO',
            role: 'Disclosing & Receiving Party',
            partyOrder: 1,
            viewToken: viewTokenPartyA,
            accessCode: '102938',
            status: 'PENDING',
          },
          {
            name: 'Kavita Menon',
            email: 'kavita.m@vertexventures.com',
            phone: '+91 99000 88776',
            organization: 'Vertex Ventures Asia IV',
            designation: 'General Partner',
            role: 'Disclosing & Receiving Party',
            partyOrder: 2,
            viewToken: viewTokenPartyB,
            accessCode: '584920',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  const shareToken2 = crypto.randomBytes(24).toString('hex');
  const viewTokenPartyA2 = crypto.randomBytes(24).toString('hex');
  const viewTokenPartyB2 = crypto.randomBytes(24).toString('hex');

  const partyAId = 'pty_' + crypto.randomBytes(8).toString('hex');
  const agreement2 = await prisma.agreement.create({
    data: {
      trackingNumber: 'AGR-2026-0002',
      templateId: templateMOU.id,
      title: 'Strategic R&D Joint Collaboration MOU - Innovate BioLabs & CSIR',
      category: 'MOU_AGREEMENTS',
      status: 'PARTIALLY_SIGNED',
      content: templateMOU.defaultContent,
      effectiveDate: new Date(),
      secureShareToken: shareToken2,
      createdById: admin.id,
      parties: {
        create: [
          {
            id: partyAId,
            name: 'Dr. Priya Nambiar',
            email: 'client@innovate.in',
            phone: '+91 98450 67890',
            organization: 'Innovate BioLabs LLP',
            designation: 'Chief Scientific Officer',
            role: 'Collaborating Institution A',
            partyOrder: 1,
            viewToken: viewTokenPartyA2,
            accessCode: '392817',
            openedAt: new Date(Date.now() - 3600000 * 5),
            reviewedAt: new Date(Date.now() - 3600000 * 4),
            status: 'SIGNED',
          },
          {
            name: 'Prof. Sandeep Kulkarni',
            email: 'director@csir-iict.res.in',
            phone: '+91 94400 33221',
            organization: 'CSIR - Indian Institute of Chemical Technology',
            designation: 'Director of Applied Research',
            role: 'Collaborating Institution B',
            partyOrder: 2,
            viewToken: viewTokenPartyB2,
            accessCode: '746192',
            openedAt: new Date(Date.now() - 3600000 * 2),
            status: 'VIEWED',
          },
        ],
      },
    },
  });

  await prisma.agreementSignature.create({
    data: {
      agreementId: agreement2.id,
      partyId: partyAId,
      signatureType: 'TYPED_LEGAL',
      signatureData: 'Dr. Priya Nambiar [Digital Token Verified]',
      signerName: 'Dr. Priya Nambiar',
      signerEmail: 'client@innovate.in',
      ipAddress: '103.21.144.12',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      legalConsentStatement: 'I hereby confirm that I have reviewed this agreement and agree to be legally bound pursuant to Section 10A of the Information Technology Act, 2000.',
      checksum: crypto.createHash('sha256').update(`Innovate-CSIR-MOU-${partyAId}`).digest('hex'),
    },
  });

  // 8. Compliance Records
  await prisma.complianceRecord.create({
    data: {
      trackingNumber: 'CMP-2026-0081',
      clientId: clientTechCorp.id,
      requestId: req2.id,
      title: 'Digital Personal Data Protection (DPDP) Act 2023 Readiness Audit',
      category: 'Data Protection & Cyber Law',
      authority: 'Data Protection Board of India',
      deadline: new Date(Date.now() + 45 * 86400000),
      status: 'IN_PROGRESS',
      assignedToId: counsel.id,
      notes: 'Review consent architecture, notice templates in 22 scheduled languages, and data fiduciary grievance redressal mechanism.',
      tasks: {
        createMany: {
          data: [
            {
              title: 'Draft bilingual User Consent Notice for consumer sign-up',
              description: 'Clear, itemised notice in plain English and Hindi specifying purposes of processing.',
              isCompleted: true,
              dueDate: new Date(Date.now() - 5 * 86400000),
              completedAt: new Date(Date.now() - 4 * 86400000),
            },
            {
              title: 'Appoint Data Protection Officer (DPO) and register details',
              description: 'Mandatory for Significant Data Fiduciary (SDF) classification.',
              isCompleted: false,
              dueDate: new Date(Date.now() + 15 * 86400000),
            },
            {
              title: 'Execute Data Processing Addenda with cloud hosting vendors',
              description: 'AWS India and Razorpay data transfer and breach reporting obligations within 6 hours.',
              isCompleted: false,
              dueDate: new Date(Date.now() + 30 * 86400000),
            },
          ],
        },
      },
    },
  });

  await prisma.complianceRecord.create({
    data: {
      trackingNumber: 'CMP-2026-0082',
      clientId: clientInnovate.id,
      requestId: req4.id,
      title: 'MCA LLP Form 11 Annual Return & Partner Capital Solvency Filing',
      category: 'Corporate Secretarial',
      authority: 'Ministry of Corporate Affairs (MCA) / ROC',
      deadline: new Date(Date.now() + 25 * 86400000),
      status: 'PENDING',
      assignedToId: associate.id,
      notes: 'Ensure all designated partner DSCs (Class 3) are active and verified on MCA V3 portal.',
      tasks: {
        createMany: {
          data: [
            {
              title: 'Verify DSC token validity for all designated partners',
              description: 'Class 3 Digital Signature Certificate must have at least 6 months validity.',
              isCompleted: true,
              dueDate: new Date(Date.now() - 2 * 86400000),
              completedAt: new Date(Date.now() - 1 * 86400000),
            },
            {
              title: 'Upload statement of accounts certified by statutory auditor',
              description: 'Attach audited balance sheet and partner profit-sharing schedule.',
              isCompleted: false,
              dueDate: new Date(Date.now() + 10 * 86400000),
            },
          ],
        },
      },
    },
  });

  // 9. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: clientTechCorp.id,
        title: 'Action Required: Sign Agreement',
        message: 'Your Mutual Non-Disclosure Agreement (AGR-2026-0001) is ready for your digital signature.',
        type: 'SIGNATURE_REQUEST',
        link: `/agreements/sign/${agreement1.secureShareToken}`,
      },
      {
        userId: clientTechCorp.id,
        title: 'Request Update: LEG-2026-1001',
        message: 'Senior Counsel Ananya Deshmukh updated the status to In Progress with drafted term sheet covenants.',
        type: 'REQUEST_STATUS',
        link: `/portal/requests/${req1.id}`,
      },
      {
        userId: clientInnovate.id,
        title: 'Counterparty Signature Update',
        message: 'Dr. Priya Nambiar signed Strategic R&D Joint Collaboration MOU. Awaiting CSIR counter-signature.',
        type: 'SIGNATURE_REQUEST',
        link: `/agreements/sign/${agreement2.secureShareToken}`,
      },
      {
        userId: admin.id,
        title: 'New Service Request Submitted',
        message: 'Innovate BioLabs LLP submitted a new request for Pollution Control Board Clearance.',
        type: 'REQUEST_STATUS',
        link: `/admin/requests/${req3.id}`,
      },
    ],
  });

  // 10. Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'SYSTEM_INITIALIZED',
        entityType: 'SYSTEM',
        details: 'LEGALITY platform seeded with standard templates, client accounts, and demo workflows.',
      },
      {
        userId: clientTechCorp.id,
        action: 'REQUEST_SUBMITTED',
        entityType: 'REQUEST',
        entityId: req1.id,
        details: 'Client Rajesh Sharma submitted service request for Series-A Term Sheet review.',
      },
      {
        userId: counsel.id,
        action: 'REQUEST_ASSIGNED',
        entityType: 'REQUEST',
        entityId: req1.id,
        details: 'Admin assigned Senior Counsel Ananya Deshmukh as Primary Counsel.',
      },
      {
        userId: clientInnovate.id,
        action: 'AGREEMENT_SIGNED',
        entityType: 'AGREEMENT',
        entityId: agreement2.id,
        details: 'Dr. Priya Nambiar electronically executed AGR-2026-0002 with verified digital timestamp.',
      },
    ],
  });

  console.log('Seeding completed successfully!');
  console.log(`- Admin: admin@legality.in (Pass: Admin@123456)`);
  console.log(`- Counsel: counsel@legality.in (Pass: Admin@123456)`);
  console.log(`- Associate: associate@legality.in (Pass: Admin@123456)`);
  console.log(`- Client 1: client@techcorp.in (Pass: Client@123456)`);
  console.log(`- Client 2: client@innovate.in (Pass: Client@123456)`);
  console.log(`- Agreement 1 Token: ${agreement1.secureShareToken}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
