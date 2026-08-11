const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SEED_DATA = [
  {
    name: 'AI & Automation',
    slug: 'ai-automation',
    icon: '🤖',
    order: 1,
    subcategories: [
      { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Work on cutting-edge AI projects' },
      { name: 'Prompt Engineering', slug: 'prompt-engineering', description: 'Craft prompts for better AI outputs' },
      { name: 'AI Model Training', slug: 'ai-model-training', description: 'Label, train and fine-tune AI models' },
      { name: 'Chatbot Development', slug: 'chatbot-development', description: 'Deploy conversational bots' },
      { name: 'AI Content Creation', slug: 'ai-content-creation', description: 'Write and edit AI-assisted content' },
      { name: 'Generative AI', slug: 'generative-ai', description: 'Build with generative AI tools' },
    ]
  },
  {
    name: 'Development & IT',
    slug: 'development-it',
    icon: '💻',
    order: 2,
    subcategories: [
      { name: 'Full Stack Development', slug: 'full-stack', description: 'End-to-end web development projects' },
      { name: 'Frontend Development', slug: 'frontend', description: 'Build beautiful, responsive interfaces' },
      { name: 'Backend Development', slug: 'backend', description: 'APIs, databases and server-side logic' },
      { name: 'Mobile App Development', slug: 'mobile', description: 'iOS and Android app development' },
      { name: 'DevOps & Cloud', slug: 'devops', description: 'CI/CD, AWS, GCP, and Kubernetes' },
      { name: 'Blockchain & Web3', slug: 'blockchain', description: 'Smart contracts and dApps' },
    ]
  },
  {
    name: 'Design & Creative',
    slug: 'design-creative',
    icon: '🎨',
    order: 3,
    subcategories: [
      { name: 'UI/UX Design', slug: 'ui-ux', description: 'Create stunning user experiences' },
      { name: '3D & WebGL', slug: '3d-webgl', description: 'Three.js, R3F, and immersive 3D web' },
      { name: 'Logo & Brand Identity', slug: 'logo-branding', description: 'Memorable brand design' },
      { name: 'Motion Graphics', slug: 'motion-graphics', description: 'Animate your brand story' },
      { name: 'Illustration', slug: 'illustration', description: 'Custom digital artwork and assets' },
      { name: 'Video Editing', slug: 'video-editing', description: 'Professional video production' },
    ]
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    icon: '📣',
    order: 4,
    subcategories: [
      { name: 'SEO & Content', slug: 'seo-content', description: 'Rank higher and drive organic traffic' },
      { name: 'Social Media Marketing', slug: 'social-media', description: 'Grow your social presence' },
      { name: 'Email Marketing', slug: 'email-marketing', description: 'Convert subscribers to customers' },
      { name: 'Performance Marketing', slug: 'performance-marketing', description: 'Run profitable ad campaigns' },
      { name: 'Copywriting', slug: 'copywriting', description: 'Words that sell and convert' },
    ]
  },
  {
    name: 'Writing & Content',
    slug: 'writing-content',
    icon: '✍️',
    order: 5,
    subcategories: [
      { name: 'Blog Writing', slug: 'blog-writing', description: 'Engaging articles and blog posts' },
      { name: 'Technical Writing', slug: 'technical-writing', description: 'Docs, API guides and manuals' },
      { name: 'Business Writing', slug: 'business-writing', description: 'Proposals, reports and presentations' },
      { name: 'Creative Writing', slug: 'creative-writing', description: 'Stories, scripts and fiction' },
      { name: 'Translation', slug: 'translation', description: 'Multilingual content services' },
    ]
  },
  {
    name: 'Admin & Support',
    slug: 'admin-support',
    icon: '🗂️',
    order: 6,
    subcategories: [
      { name: 'Virtual Assistance', slug: 'virtual-assistance', description: 'Administrative support and scheduling' },
      { name: 'Customer Service', slug: 'customer-service', description: 'Delight your customers every interaction' },
      { name: 'Data Entry', slug: 'data-entry', description: 'Accurate data processing and cleaning' },
      { name: 'Project Management', slug: 'project-management', description: 'Keep teams and timelines on track' },
    ]
  }
];

async function main() {
  console.log('Starting category seed...');
  let created = 0;
  let skipped = 0;

  for (const catData of SEED_DATA) {
    const { subcategories, ...categoryFields } = catData;
    
    const existing = await prisma.category.findUnique({ where: { slug: categoryFields.slug } });
    if (existing) {
      console.log(`Skipping existing: ${categoryFields.name}`);
      skipped++;
      continue;
    }

    const category = await prisma.category.create({
      data: {
        ...categoryFields,
        subcategories: {
          create: subcategories
        }
      }
    });
    console.log(`Created: ${category.name} (${category.id})`);
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
