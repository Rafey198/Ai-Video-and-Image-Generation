export const SITE_CONFIG = {
  name: "VireoMorph",
  tagline: "Generate. Animate. Remix. Sync.",
  description:
    "Premium AI creative studio for generating, animating, remixing, and syncing images, videos, and audio.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
};

export const FILE_LIMITS = {
  maxImageSize: 10 * 1024 * 1024,
  maxVideoSize: 100 * 1024 * 1024,
  maxAudioSize: 20 * 1024 * 1024,
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedVideoTypes: ["video/mp4", "video/webm", "video/quicktime"],
  allowedAudioTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
};

export const RATE_LIMITS = {
  api: { windowMs: 60_000, max: 60 },
  generation: { windowMs: 60_000, max: 10 },
  auth: { windowMs: 900_000, max: 10 },
};

export const FREE_TRIAL_CREDITS = 100;

export const ROLES = {
  USER: "user",
  CREATOR: "creator",
  TEAM_ADMIN: "team_admin",
  DEVELOPER: "developer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export const ADMIN_ROLES = ["admin", "super_admin", "developer"] as const;

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/models", label: "Models" },
  { href: "/showcase", label: "Showcase" },
  { href: "/pricing", label: "Pricing" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/blog", label: "Blog" },
];

export const FOOTER_LINKS = {
  product: [
    { href: "/features", label: "Features" },
    { href: "/models", label: "Models" },
    { href: "/showcase", label: "Showcase" },
    { href: "/pricing", label: "Pricing" },
    { href: "/enterprise", label: "Enterprise" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Support" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/acceptable-use", label: "Acceptable Use" },
    { href: "/dmca", label: "DMCA" },
    { href: "/security", label: "Security" },
  ],
};

export const SOCIAL_LINKS = [
  { href: "#", label: "Twitter", icon: "Twitter" },
  { href: "#", label: "GitHub", icon: "Github" },
  { href: "#", label: "Discord", icon: "MessageCircle" },
  { href: "#", label: "YouTube", icon: "Youtube" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/digital-product", label: "Digital Product Studio", icon: "Package" },
  { href: "/studio/image", label: "Image Studio", icon: "Image" },
  { href: "/studio/video", label: "Video Studio", icon: "Video" },
  { href: "/studio/audio", label: "Audio Studio", icon: "Music" },
  { href: "/studio/sync", label: "Sync Studio", icon: "AudioLines" },
  { href: "/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/history", label: "History", icon: "History" },
  { href: "/gallery", label: "Gallery", icon: "Images" },
  { href: "/favorites", label: "Favorites", icon: "Heart" },
  { href: "/uploads", label: "Uploads", icon: "Upload" },
  { href: "/billing", label: "Billing", icon: "CreditCard" },
  { href: "/models/library", label: "Model Library", icon: "Cpu" },
  { href: "/prompts", label: "Prompt Library", icon: "BookOpen" },
  { href: "/settings", label: "Settings", icon: "Settings" },
  { href: "/notifications", label: "Notifications", icon: "Bell" },
  { href: "/api-keys", label: "API Keys", icon: "Key" },
  { href: "/team", label: "Team", icon: "Users" },
  { href: "/support", label: "Support", icon: "HelpCircle" },
];

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: "LayoutDashboard" },
  { href: "/admin/users", label: "Users", icon: "Users" },
  { href: "/admin/models", label: "Model Registry", icon: "Cpu" },
  { href: "/admin/providers", label: "Providers", icon: "Server" },
  { href: "/admin/jobs", label: "Job Queue", icon: "ListOrdered" },
  { href: "/admin/storage", label: "Storage", icon: "HardDrive" },
  { href: "/admin/credits", label: "Credits & Billing", icon: "CreditCard" },
  { href: "/admin/pricing", label: "Pricing", icon: "DollarSign" },
  { href: "/admin/prompts", label: "Prompt Templates", icon: "BookOpen" },
  { href: "/admin/styles", label: "Style Presets", icon: "Palette" },
  { href: "/admin/moderation", label: "Safety Rules", icon: "Shield" },
  { href: "/admin/content", label: "Website Content", icon: "FileText" },
  { href: "/admin/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/admin/logs", label: "System Logs", icon: "ScrollText" },
  { href: "/admin/feature-flags", label: "Feature Flags", icon: "Flag" },
  { href: "/admin/api", label: "API & Webhooks", icon: "Webhook" },
  { href: "/admin/database", label: "Database", icon: "Database" },
  { href: "/admin/deployment", label: "Deployment", icon: "Rocket" },
];
