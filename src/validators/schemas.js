import { z } from "zod";

const id = z.string().trim().min(1).max(50);
const email = z.string().trim().toLowerCase().email().max(254);
const currency = z.enum(["INR", "USD", "EUR", "GBP", "AED", "SGD"]);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password: z.string().min(8).max(128),
  role: z.enum(["client", "provider"])
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128)
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  headline: z.string().trim().max(140).default(""),
  bio: z.string().trim().max(1800).default(""),
  location: z.string().trim().max(140).default(""),
  country: z.string().trim().max(80).default(""),
  skills: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  hourlyRate: z.coerce.number().min(0).max(10000000).default(0),
  companyName: z.string().trim().max(140).default(""),
  website: z.string().trim().max(240).default(""),
  portfolioUrl: z.string().trim().max(240).default(""),
  availability: z.enum(["available", "limited", "unavailable"]).default("available")
});

export const projectSchema = z.object({
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(50).max(8000),
  category: z.string().trim().min(2).max(100),
  subcategory: z.string().trim().max(100).default(""),
  skills: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  contractType: z.enum(["fixed", "hourly"]),
  budget: z.coerce.number().positive().max(1000000000).nullable().optional(),
  hourlyMin: z.coerce.number().positive().max(10000000).nullable().optional(),
  hourlyMax: z.coerce.number().positive().max(10000000).nullable().optional(),
  currency: currency.default("INR"),
  experienceLevel: z.enum(["entry", "intermediate", "expert"]).default("intermediate"),
  locationType: z.enum(["remote", "hybrid", "onsite"]).default("remote"),
  location: z.string().trim().max(160).default("Remote"),
  duration: z.enum(["under_1_month", "1_3_months", "3_6_months", "over_6_months", "ongoing"]).default("1_3_months"),
  expirationDate: z.coerce.date()
}).superRefine((value, ctx) => {
  if (value.contractType === "fixed" && !value.budget) {
    ctx.addIssue({ code: "custom", path: ["budget"], message: "Budget is required for fixed-price work." });
  }
  if (
    value.contractType === "hourly" &&
    (!value.hourlyMin || !value.hourlyMax || value.hourlyMin > value.hourlyMax)
  ) {
    ctx.addIssue({ code: "custom", path: ["hourlyMin"], message: "Enter a valid hourly range." });
  }
});

export const proposalSchema = z.object({
  projectId: id,
  coverLetter: z.string().trim().min(40).max(5000),
  bidAmount: z.coerce.number().positive().max(1000000000),
  estimatedDays: z.coerce.number().int().min(1).max(3650)
});

export const proposalDecisionSchema = z.object({
  action: z.enum(["shortlist", "reject"]),
  note: z.string().trim().max(1500).default("")
});

export const milestoneSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2200).default(""),
  amount: z.coerce.number().positive().max(1000000000),
  dueDate: z.coerce.date().nullable().optional()
});

export const offerSchema = z.object({
  milestones: z.array(milestoneSchema).max(30).default([])
});

export const messageSchema = z.object({
  body: z.string().trim().min(1).max(5000)
});

export const milestoneSubmissionSchema = z.object({
  note: z.string().trim().min(2).max(3000)
});

export const milestoneDecisionSchema = z.object({
  action: z.enum(["approve", "request_revision"]),
  note: z.string().trim().max(3000).default("")
});

export const reviewSchema = z.object({
  contractId: id,
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2500).default("")
});

export const userStatusSchema = z.object({
  status: z.enum(["active", "suspended", "closed"])
});

export const adminSubscriptionSchema = z.object({
  plan: z.enum(["free", "provider", "client", "business"]),
  status: z.enum(["active", "inactive", "expired", "cancelled"]),
  expiresAt: z.coerce.date().nullable().optional()
});
