import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const RECORD_TYPES = [
  "business_name",
  "brand_name",
  "industry",
  "category",
  "audience",
  "pain_point",
  "benefit",
  "feature",
  "pricing",
  "faq",
  "testimonial",
  "case_study",
  "cta",
  "description",
  "founder_bio",
  "mission",
  "value",
  "color_palette",
  "typography",
  "visual_style",
  "layout",
  "contact",
  "social",
  "disclaimer",
  "licensing",
] as const;

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Education",
  "Restaurant",
  "SaaS",
  "Marketing Agency",
  "E-commerce",
  "Fitness",
  "Legal",
  "Consulting",
  "Manufacturing",
  "Non-profit",
  "Entertainment",
];

const VISUAL_STYLES = [
  "modern minimal",
  "corporate",
  "luxury",
  "tech",
  "playful",
  "editorial",
  "bold",
  "organic",
];

const COLOR_PALETTES = [
  ["#0F172A", "#3B82F6", "#60A5FA", "#F8FAFC", "#94A3B8"],
  ["#1A1A2E", "#E94560", "#F5A623", "#FFFFFF", "#16213E"],
  ["#0D1B2A", "#1B998B", "#E8F1F2", "#FF6B35", "#2E4057"],
  ["#2D3142", "#EF8354", "#4F5D75", "#FFFFFF", "#BFC0C0"],
  ["#1B4332", "#40916C", "#95D5B2", "#D8F3DC", "#081C15"],
  ["#240046", "#7B2CBF", "#C77DFF", "#E0AAFF", "#10002B"],
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#1ABC9C"],
];

const SPREADSHEET_TYPES = [
  "ultimate_project_manager",
  "ultimate_budget",
  "weekly_planner_pro",
  "crm_tracker",
  "expense_tracker",
  "sales_dashboard",
];

function generateRecord(recordType: string, industry: string) {
  switch (recordType) {
    case "business_name":
      return { text: faker.company.name(), industry };
    case "brand_name":
      return { text: faker.company.name(), tagline: faker.company.catchPhrase() };
    case "industry":
      return { text: industry, subcategories: faker.helpers.arrayElements(["B2B", "B2C", "Enterprise", "SMB"], 2) };
    case "category":
      return { text: faker.commerce.department(), industry };
    case "audience":
      return { text: faker.helpers.arrayElement(["Small business owners", "Enterprise teams", "Freelancers", "Startups", "Agencies", "Students"]) };
    case "pain_point":
      return { text: faker.helpers.arrayElement([
        "Manual processes waste valuable time",
        "Lack of visibility into key metrics",
        "Difficulty scaling operations",
        "Poor customer retention rates",
        "Inconsistent brand messaging",
        "High operational costs",
        "Siloed team communication",
      ]) };
    case "benefit":
      return { text: faker.helpers.arrayElement([
        "Increase productivity by 40%",
        "Reduce costs significantly",
        "Improve customer satisfaction",
        "Accelerate time to market",
        "Streamline workflows",
        "Enable data-driven decisions",
      ]) };
    case "feature":
      return { text: faker.helpers.arrayElement([
        "Real-time analytics dashboard",
        "Automated workflow engine",
        "Team collaboration tools",
        "API integrations",
        "Custom reporting",
        "Mobile-first design",
        "AI-powered insights",
      ]) };
    case "pricing":
      return {
        name: faker.helpers.arrayElement(["Starter", "Professional", "Enterprise"]),
        price: `$${faker.number.int({ min: 19, max: 199 })}`,
        period: "/month",
        features: faker.helpers.arrayElements(["Unlimited users", "Priority support", "API access", "Custom branding", "Analytics"], 3),
      };
    case "faq":
      return {
        question: faker.helpers.arrayElement([
          "How do I get started?",
          "What payment methods do you accept?",
          "Can I upgrade my plan?",
          "Is my data secure?",
          "Do you offer refunds?",
        ]),
        answer: faker.lorem.sentences(2),
      };
    case "testimonial":
      return {
        quote: faker.lorem.sentences(2),
        author: faker.person.fullName(),
        role: faker.person.jobTitle(),
        company: faker.company.name(),
      };
    case "case_study":
      return {
        title: `${faker.company.name()} Success Story`,
        challenge: faker.lorem.sentences(2),
        solution: faker.lorem.sentences(2),
        result: faker.helpers.arrayElement(["40% cost reduction", "3x revenue growth", "50% faster delivery"]),
      };
    case "cta":
      return { text: faker.helpers.arrayElement(["Get Started Free", "Book a Demo", "Start Your Trial", "Contact Sales", "Download Now"]) };
    case "description":
      return { text: faker.company.catchPhrase() + ". " + faker.lorem.paragraph() };
    case "founder_bio":
      return { text: `${faker.person.fullName()} is a ${faker.person.jobTitle()} with ${faker.number.int({ min: 5, max: 20 })} years of experience.` };
    case "mission":
      return { text: faker.helpers.arrayElement([
        "Empowering businesses to achieve more",
        "Making professional tools accessible to everyone",
        "Transforming how teams collaborate",
        "Building the future of work",
      ]) };
    case "value":
      return { text: faker.helpers.arrayElement(["Innovation", "Integrity", "Excellence", "Collaboration", "Customer Focus", "Transparency"]) };
    case "color_palette":
      return { colors: faker.helpers.arrayElement(COLOR_PALETTES) };
    case "typography":
      return {
        heading: faker.helpers.arrayElement(["Inter", "Poppins", "Montserrat", "Playfair Display"]),
        body: faker.helpers.arrayElement(["Inter", "Open Sans", "Roboto", "Lato"]),
      };
    case "visual_style":
      return { text: faker.helpers.arrayElement(VISUAL_STYLES) };
    case "layout":
      return { text: faker.helpers.arrayElement(["hero-features-cta", "split-panel", "grid-cards", "timeline", "tri-fold-panels"]) };
    case "contact":
      return {
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        website: faker.internet.url(),
      };
    case "social":
      return {
        twitter: `@${faker.internet.username()}`,
        linkedin: faker.internet.url(),
        instagram: `@${faker.internet.username()}`,
      };
    case "disclaimer":
      return { text: "This document is for informational purposes only. All trademarks belong to their respective owners." };
    case "licensing":
      return { text: "Licensed for personal and commercial use. Redistribution requires attribution." };
    default:
      return { text: faker.lorem.sentence() };
  }
}

export async function seedDigitalProductData(prisma: PrismaClient) {
  console.log("Seeding Digital Product Studio data...");

  const existing = await prisma.seedBusinessData.count();
  if (existing >= 1000) {
    console.log(`  Skipping seed: ${existing} records already exist`);
    return;
  }

  const businessRecords = [];
  const targetCount = 1000;

  for (let i = 0; i < targetCount; i++) {
    const industry = faker.helpers.arrayElement(INDUSTRIES);
    const recordType = RECORD_TYPES[i % RECORD_TYPES.length]!;
    businessRecords.push({
      recordType,
      industry,
      category: faker.commerce.department(),
      content: generateRecord(recordType, industry),
      tags: faker.helpers.arrayElements(["premium", "startup", "enterprise", "creative"], 2),
      locale: "en",
    });
  }

  await prisma.seedBusinessData.createMany({ data: businessRecords });

  const industryRecords = INDUSTRIES.map((industry) => ({
    industry,
    subcategory: faker.commerce.department(),
    data: {
      marketSize: `$${faker.number.int({ min: 1, max: 500 })}B`,
      growthRate: `${faker.number.int({ min: 5, max: 25 })}%`,
      keyTrends: faker.helpers.arrayElements(["AI adoption", "Remote work", "Sustainability", "Personalization"], 3),
      topPainPoints: faker.helpers.arrayElements(["Cost pressure", "Talent shortage", "Digital transformation"], 2),
    },
  }));

  await prisma.seedIndustryData.createMany({ data: industryRecords });

  const spreadsheetRecords = [];
  for (const templateType of SPREADSHEET_TYPES) {
    const tabs = ["Dashboard", "Data", "Reports", "Setup", "Instructions"];
    for (const tabName of tabs) {
      spreadsheetRecords.push({
        templateType,
        tabName,
        category: templateType,
        data: {
          headers: ["ID", "Name", "Status", "Value", "Date"],
          sampleRows: Array.from({ length: 5 }, () => [
            faker.string.uuid().slice(0, 8),
            faker.commerce.productName(),
            faker.helpers.arrayElement(["Active", "Pending", "Complete"]),
            faker.number.int({ min: 100, max: 10000 }),
            faker.date.recent().toISOString().split("T")[0],
          ]),
        },
        formulas: [
          { cell: "E2", formula: "SUM(D2:D6)" },
          { cell: "E3", formula: "AVERAGE(D2:D6)" },
        ],
      });
    }
  }

  await prisma.seedSpreadsheetData.createMany({ data: spreadsheetRecords });

  const categories = [
    { slug: "one-pagers", name: "One-Pagers", productType: "one_pager" as const },
    { slug: "business", name: "Business Templates", productType: "business_template" as const },
    { slug: "brochures", name: "Brochures", productType: "brochure" as const },
    { slug: "logos", name: "Logos", productType: "logo" as const },
    { slug: "spreadsheets", name: "Excel Templates", productType: "spreadsheet" as const },
    { slug: "planners", name: "Planners", productType: "planner" as const },
    { slug: "bulk-packs", name: "Digital Packs", productType: "bulk_pack" as const },
  ];

  for (const cat of categories) {
    await prisma.templateCategory.upsert({
      where: { slug: cat.slug },
      create: { ...cat, description: `Professional ${cat.name.toLowerCase()}`, sortOrder: categories.indexOf(cat) },
      update: {},
    });
  }

  const allCategories = await prisma.templateCategory.findMany();

  for (const cat of allCategories) {
    const existingTemplates = await prisma.template.count({ where: { categoryId: cat.id } });
    if (existingTemplates > 0) continue;

    const templates = Array.from({ length: 6 }, (_, i) => ({
      categoryId: cat.id,
      slug: `${cat.slug}-template-${i + 1}`,
      name: `${cat.name} Template ${i + 1}`,
      description: faker.lorem.sentence(),
      productType: cat.productType,
      difficulty: faker.helpers.arrayElement(["beginner", "intermediate", "advanced"]),
      defaultSize: "us_letter",
      pageCount: faker.number.int({ min: 1, max: 5 }),
      tabCount: faker.number.int({ min: 3, max: 15 }),
      exportFormats: ["pdf", "png", "pptx", "json"],
      featured: i < 2,
      sortOrder: i,
      contentTemplate: { title: faker.company.name(), subtitle: faker.company.catchPhrase() },
      designTemplate: { colorPalette: faker.helpers.arrayElement(COLOR_PALETTES) },
    }));

    await prisma.template.createMany({ data: templates });
  }

  console.log(`  Seeded ${targetCount} business records, ${industryRecords.length} industries, ${spreadsheetRecords.length} spreadsheet records`);
}
