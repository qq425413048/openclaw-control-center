export interface GroupTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  departments: string[];
  roles: string[];
}

export interface Department {
  id: string;
  name: string;
  nameEn: string;
  count: number;
}

export const GROUP_TEMPLATES: GroupTemplate[] = [
  {
    id: "game-dev-unity",
    name: "Unity游戏开发",
    nameEn: "Unity Game Development",
    description: "完整Unity游戏开发团队",
    icon: "🎮",
    departments: ["game-development", "design", "testing", "product"],
    roles: [
      "game-development-unity-developer",
      "game-development-unity-developer", 
      "design-ui-designer",
      "testing-qa-engineer",
      "product-manager"
    ]
  },
  {
    id: "game-dev-web3",
    name: "Web3游戏开发",
    nameEn: "Web3 Game Development",
    description: "区块链游戏开发团队",
    icon: "🪙",
    departments: ["game-development", "engineering", "design"],
    roles: [
      "game-development-unreal-developer",
      "engineering-solidity-smart-contract-engineer",
      "design-ui-designer",
      "design-visual-storyteller"
    ]
  },
  {
    id: "web-backend",
    name: "Web后端开发",
    nameEn: "Web Backend Development",
    description: "全栈Web应用后端开发",
    icon: "🌐",
    departments: ["engineering", "design", "testing"],
    roles: [
      "engineering-backend-architect",
      "engineering-senior-developer",
      "engineering-database-optimizer",
      "design-ux-architect",
      "testing-qa-engineer"
    ]
  },
  {
    id: "web-frontend",
    name: "Web前端开发", 
    nameEn: "Web Frontend Development",
    description: "现代Web应用前端开发",
    icon: "📱",
    departments: ["engineering", "design", "testing"],
    roles: [
      "engineering-frontend-developer",
      "engineering-frontend-developer",
      "design-ui-designer",
      "design-ux-researcher"
    ]
  },
  {
    id: "ai-product",
    name: "AI产品开发",
    nameEn: "AI Product Development",
    description: "AI驱动的产品开发",
    icon: "🤖",
    departments: ["engineering", "product", "design"],
    roles: [
      "engineering-ai-engineer",
      "product-manager",
      "engineering-data-engineer",
      "design-ui-designer"
    ]
  },
  {
    id: "devops-sre",
    name: "DevOps运维",
    nameEn: "DevOps & SRE",
    description: "系统运维与可靠性工程",
    icon: "🔧",
    departments: ["engineering"],
    roles: [
      "engineering-sre",
      "engineering-devops-automator",
      "engineering-security-engineer",
      "engineering-incident-response-commander"
    ]
  },
  {
    id: "marketing-campaign",
    name: "营销活动",
    nameEn: "Marketing Campaign",
    description: "产品或品牌营销活动",
    icon: "📢",
    departments: ["marketing", "design", "paid-media"],
    roles: [
      "marketing-strategist",
      "design-ui-designer",
      "design-visual-storyteller",
      "paid-media-ads-specialist",
      "marketing-social-media-manager"
    ]
  },
  {
    id: "support-team",
    name: "技术支持",
    nameEn: "Technical Support",
    description: "客户技术支持团队",
    icon: "🎧",
    departments: ["support", "product"],
    roles: [
      "support-level-1",
      "support-level-2",
      "product-manager"
    ]
  },
  {
    id: "content-creation",
    name: "内容创作",
    nameEn: "Content Creation",
    description: "多平台内容创作与分发",
    icon: "✍️",
    departments: ["marketing", "design"],
    roles: [
      "marketing-content-writer",
      "design-visual-storyteller",
      "design-image-prompt-engineer",
      "marketing-social-media-manager"
    ]
  },
  {
    id: "data-analytics",
    name: "数据分析",
    nameEn: "Data Analytics",
    description: "数据驱动的业务洞察",
    icon: "📊",
    departments: ["engineering", "finance", "product"],
    roles: [
      "engineering-data-engineer",
      "finance-data-analyst",
      "product-manager",
      "engineering-ai-engineer"
    ]
  },
  {
    id: "custom",
    name: "自定义",
    nameEn: "Custom",
    description: "从零开始选择参与者",
    icon: "✨",
    departments: ["all"],
    roles: []
  }
];

export const DEPARTMENTS: Department[] = [
  { id: "engineering", name: "工程部", nameEn: "Engineering", count: 34 },
  { id: "design", name: "设计部", nameEn: "Design", count: 8 },
  { id: "marketing", name: "营销部", nameEn: "Marketing", count: 36 },
  { id: "paid-media", name: "付费媒体部", nameEn: "Paid Media", count: 7 },
  { id: "sales", name: "销售部", nameEn: "Sales", count: 8 },
  { id: "finance", name: "金融部", nameEn: "Finance", count: 8 },
  { id: "product", name: "产品部", nameEn: "Product", count: 5 },
  { id: "project-management", name: "项目管理部", nameEn: "Project Management", count: 6 },
  { id: "testing", name: "测试部", nameEn: "Testing", count: 9 },
  { id: "support", name: "支持部", nameEn: "Support", count: 8 },
  { id: "specialized", name: "专项部", nameEn: "Specialized", count: 46 },
  { id: "game-development", name: "游戏开发部", nameEn: "Game Development", count: 20 },
  { id: "spatial-computing", name: "空间计算部", nameEn: "Spatial Computing", count: 6 },
  { id: "academic", name: "学术部", nameEn: "Academic", count: 6 }
];