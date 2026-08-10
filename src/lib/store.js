// Global In-Memory & LocalStorage Data Store for Upwork 3D Marketplace Blueprint

export const SAMPLE_USERS = [
  {
    id: "usr_freelancer_1",
    name: "Alex Rivera",
    email: "alex.rivera@3dmagic.io",
    role: "FREELANCER",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    bio: "Senior 3D Artist & React Three Fiber Specialist with 7+ years creating immersive web experiences, Three.js shaders, and interactive products.",
    hourlyRate: 95,
    skills: ["React Three Fiber", "Three.js", "WebGL", "Blender", "Shadcn UI", "TypeScript"],
    kycVerified: true,
    rating: 4.98,
    jobsCompleted: 34,
    earnedTotal: 128500
  },
  {
    id: "usr_freelancer_2",
    name: "Elena Rostova",
    email: "elena.design@workiffy.com",
    role: "FREELANCER",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    bio: "Full Stack AI Engineer & Next.js 15 Architect. Expert in building real-time collaboration engines, vector search pipelines, and glassmorphism UIs.",
    hourlyRate: 110,
    skills: ["Next.js 15", "Prisma ORM", "Tailwind CSS", "PostgreSQL", "Socket.io", "Python AI"],
    kycVerified: true,
    rating: 5.0,
    jobsCompleted: 42,
    earnedTotal: 184000
  },
  {
    id: "usr_client_1",
    name: "Marcus Vance",
    email: "marcus@metaverse-labs.co",
    role: "CLIENT",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    bio: "CTO at Metaverse Labs Inc. Hiring top tier 3D spatial web developers and full stack engineers for next-gen SaaS products.",
    kycVerified: true,
    company: "Metaverse Labs Inc",
    spentTotal: 340000
  },
  {
    id: "usr_admin_1",
    name: "Super Admin Console",
    email: "admin@3dmarketplace.com",
    role: "ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    bio: "Platform Governance & Escrow Dispute Arbiter",
    kycVerified: true
  }
];

export const SAMPLE_JOBS = [
  {
    id: "job_101",
    title: "Interactive 3D Workspace Node Canvas & Product Showcase (R3F + Next.js 15)",
    description: "We are seeking a senior React Three Fiber developer to build an isometric 3D product visualizer with glowing node paths, Draco compressed GLTF loaders, and smooth 60fps camera transitions.",
    type: "FIXED_PRICE",
    budget: 4500,
    category: "3D & WebGL Development",
    skills: ["React Three Fiber", "Three.js", "Next.js 15", "WebGL", "GLSL Shaders"],
    clientId: "usr_client_1",
    clientName: "Metaverse Labs Inc",
    clientVerified: true,
    proposalsCount: 8,
    createdAt: "2026-08-08T10:00:00Z",
    status: "OPEN"
  },
  {
    id: "job_102",
    title: "Upwork-Grade Escrow Payment & Milestone Pipeline with Stripe Connect",
    description: "Looking for an expert backend engineer to construct a multi-party escrow release workflow, Webhook status handlers, and automated refund/dispute resolution system.",
    type: "HOURLY",
    budget: 95,
    category: "Full Stack & Payments",
    skills: ["Stripe Connect", "Next.js 15", "Prisma ORM", "PostgreSQL", "Node.js"],
    clientId: "usr_client_1",
    clientName: "Metaverse Labs Inc",
    clientVerified: true,
    proposalsCount: 14,
    createdAt: "2026-08-09T14:30:00Z",
    status: "OPEN"
  },
  {
    id: "job_103",
    title: "Glassmorphism UI Design System & Dashboard Canvas Controls",
    description: "Design and code a high-end dark glassmorphic dashboard component suite using Tailwind CSS v4, Lucide icons, and accessible interactive modal state.",
    type: "FIXED_PRICE",
    budget: 2800,
    category: "UI/UX & Frontend",
    skills: ["Tailwind CSS", "React", "Glassmorphism", "TypeScript", "Figma"],
    clientId: "usr_client_1",
    clientName: "Metaverse Labs Inc",
    clientVerified: true,
    proposalsCount: 6,
    createdAt: "2026-08-10T09:15:00Z",
    status: "OPEN"
  }
];

export const SAMPLE_PROPOSALS = [
  {
    id: "prop_201",
    jobId: "job_101",
    freelancerId: "usr_freelancer_1",
    freelancerName: "Alex Rivera",
    freelancerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    freelancerRate: 95,
    bidAmount: 4200,
    coverLetter: "Hi Marcus, I built several R3F node canvases with instanced meshes and 60fps performance optimizations. I can complete the 3D isometric overview canvas and lighting pipelines within 2 weeks.",
    status: "SHORTLISTED",
    createdAt: "2026-08-08T14:20:00Z",
    milestones: [
      { title: "Phase 1: 3D Scene Setup & Lighting Nodes", amount: 1500 },
      { title: "Phase 2: Glowing Node Data Paths & Camera Controls", amount: 1500 },
      { title: "Phase 3: Integration & Performance Polish", amount: 1200 }
    ]
  },
  {
    id: "prop_202",
    jobId: "job_101",
    freelancerId: "usr_freelancer_2",
    freelancerName: "Elena Rostova",
    freelancerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    freelancerRate: 110,
    bidAmount: 4500,
    coverLetter: "Hello Marcus! I specialize in React Three Fiber coupled with Next.js 15 App Router server actions. Let's schedule an interview call to go over the node architecture.",
    status: "PENDING",
    createdAt: "2026-08-09T09:10:00Z",
    milestones: [
      { title: "Complete 3D Hero Scene & Canvas Engine", amount: 2500 },
      { title: "Interactive Node State Integration", amount: 2000 }
    ]
  }
];

export const SAMPLE_CONTRACTS = [
  {
    id: "cnt_301",
    jobId: "job_101",
    jobTitle: "Interactive 3D Workspace Node Canvas & Product Showcase",
    clientId: "usr_client_1",
    clientName: "Metaverse Labs Inc",
    freelancerId: "usr_freelancer_1",
    freelancerName: "Alex Rivera",
    amount: 4200,
    escrowDeposited: 4200,
    status: "ACTIVE",
    createdAt: "2026-08-09T18:00:00Z",
    milestones: [
      { id: "m1", title: "Phase 1: 3D Scene Setup & Lighting Nodes", amount: 1500, isFunded: true, isApproved: true, status: "RELEASED" },
      { id: "m2", title: "Phase 2: Glowing Node Data Paths & Camera Controls", amount: 1500, isFunded: true, isApproved: false, status: "SUBMITTED" },
      { id: "m3", title: "Phase 3: Integration & Performance Polish", amount: 1200, isFunded: false, isApproved: false, status: "PENDING" }
    ]
  }
];

export const SAMPLE_MESSAGES = [
  {
    id: "msg_1",
    senderId: "usr_client_1",
    senderName: "Marcus Vance",
    receiverId: "usr_freelancer_1",
    text: "Hi Alex! Reviewed your 3D portfolio. We want to initiate the contract for the 3D Node Canvas project with Stripe Escrow funding.",
    timestamp: "10:15 AM"
  },
  {
    id: "msg_2",
    senderId: "usr_freelancer_1",
    senderName: "Alex Rivera",
    receiverId: "usr_client_1",
    text: "Thanks Marcus! I've accepted the offer and submitted Phase 1 deliverables for your review.",
    timestamp: "10:22 AM"
  }
];

export const SAMPLE_NOTIFICATIONS = [
  { id: "n1", title: "Escrow Deposited", message: "Client Marcus Vance funded $4,200 into Stripe Escrow for Contract #cnt_301.", time: "1 hour ago", read: false },
  { id: "n2", title: "Milestone Submitted", message: "Alex Rivera submitted Phase 2 deliverables for review.", time: "30 mins ago", read: false }
];

export const SAMPLE_DISPUTES = [
  {
    id: "disp_901",
    contractId: "cnt_88",
    jobTitle: "3D Procedural Shader Node Suite",
    clientName: "NexusVR Studios",
    freelancerName: "David Chen",
    disputedAmount: 3200,
    reason: "Deliverable shader performance drops below 60fps target on mobile devices.",
    status: "OPEN",
    createdAt: "2026-08-07T12:00:00Z"
  },
  {
    id: "disp_902",
    contractId: "cnt_94",
    jobTitle: "Full Stack Next.js 15 Escrow Webhooks",
    clientName: "CyberCorp Financial",
    freelancerName: "Sophia Lin",
    disputedAmount: 1800,
    reason: "Client delayed milestone review past 14-day auto-approval threshold.",
    status: "UNDER_REVIEW",
    createdAt: "2026-08-09T16:45:00Z"
  }
];

