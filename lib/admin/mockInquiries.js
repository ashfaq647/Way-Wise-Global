// TEMPORARY SAMPLE DATA for the frontend-only admin UI. Nothing here is real and nothing
// is saved. The async functions below have the shape the database queries will have, so
// the pages only need these function bodies replaced once Prisma is set up.
//
// Fields match the public Partner With Us form (components/PartnerWithUsModal.jsx).
// Names, companies and domains are placeholders (example.com / .test addresses).

const inquiries = [
  {
    id: "inq_1012",
    fullName: "Sample Contact A",
    jobTitle: "Managing Director",
    company: "Example Holdings",
    email: "contact.a@example.com",
    phone: "+971 50 000 0001",
    website: "https://example.com",
    opportunity: "Business Partnership",
    business: "Way Wise Tech",
    message:
      "Sample message: we are exploring a regional distribution partnership and would like to arrange an introductory call.",
    status: "NEW",
    createdAt: "2026-10-28T09:14:00Z",
  },
  {
    id: "inq_1011",
    fullName: "Sample Contact B",
    jobTitle: "Head of Procurement",
    company: "Demo Trading LLC",
    email: "contact.b@example.com",
    phone: "+1 555 000 0002",
    website: "",
    opportunity: "Specialized Services",
    business: "Way Wise Trading",
    message: "",
    status: "NEW",
    createdAt: "2026-10-27T15:42:00Z",
  },
  {
    id: "inq_1010",
    fullName: "Sample Contact C",
    jobTitle: "Founder",
    company: "Placeholder Ventures",
    email: "contact.c@example.com",
    phone: "+44 20 0000 0003",
    website: "https://example.org",
    opportunity: "International Collaboration",
    business: "Way Wise Property",
    message:
      "Sample message: interested in a joint venture for a residential project. Happy to share details on a call.",
    status: "IN_REVIEW",
    createdAt: "2026-10-26T11:05:00Z",
  },
  {
    id: "inq_1009",
    fullName: "Sample Contact D",
    jobTitle: "Operations Manager",
    company: "Test Logistics Co.",
    email: "contact.d@example.com",
    phone: "+92 300 000 0004",
    website: "https://example.net",
    opportunity: "Business Partnership",
    business: "Way Wise Jobs",
    message: "Sample message: looking for recruitment support across three sites.",
    status: "CONTACTED",
    createdAt: "2026-10-24T08:30:00Z",
  },
  {
    id: "inq_1008",
    fullName: "Sample Contact E",
    jobTitle: "CTO",
    company: "Mock Systems",
    email: "contact.e@example.com",
    phone: "+971 4 000 0005",
    website: "",
    opportunity: "Other",
    business: "Way Wise Tech",
    message: "",
    status: "IN_REVIEW",
    createdAt: "2026-10-22T13:20:00Z",
  },
  {
    id: "inq_1007",
    fullName: "Sample Contact F",
    jobTitle: "Business Development Lead",
    company: "Example Consumer Goods",
    email: "contact.f@example.com",
    phone: "+1 555 000 0006",
    website: "https://example.com/shop",
    opportunity: "Specialized Services",
    business: "Pother Bazar",
    message:
      "Sample message: we would like to list our product range and discuss wholesale terms.",
    status: "CLOSED",
    createdAt: "2026-10-18T10:00:00Z",
  },
  {
    id: "inq_1006",
    fullName: "Sample Contact G",
    jobTitle: "Partner",
    company: "Sample Construction Group",
    email: "contact.g@example.com",
    phone: "+44 161 000 0007",
    website: "",
    opportunity: "International Collaboration",
    business: "Way Wise Construction",
    message: "",
    status: "CONTACTED",
    createdAt: "2026-10-15T16:45:00Z",
  },
];

export async function getInquiries() {
  return [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getRecentInquiries(limit = 5) {
  return (await getInquiries()).slice(0, limit);
}

export async function getInquiryById(id) {
  return inquiries.find((inquiry) => inquiry.id === id) ?? null;
}

export async function getInquiryStats() {
  const count = (status) => inquiries.filter((i) => i.status === status).length;
  return {
    total: inquiries.length,
    new: count("NEW"),
    inReview: count("IN_REVIEW"),
    contacted: count("CONTACTED"),
  };
}
