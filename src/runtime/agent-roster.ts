import { join } from "node:path";
import { readdir, readFile } from "node:fs/promises";
import {
  loadCurrentAgentCatalog,
  resolveOpenClawConfigPath,
  resolveOpenClawHomePath,
} from "./current-agent-catalog";

export type AgentRosterStatus = "connected" | "partial" | "not_connected";

export interface AgentRosterEntry {
  agentId: string;
  displayName: string;
  description?: string;
  department?: string;
}

export interface AgentRosterSnapshot {
  status: AgentRosterStatus;
  sourcePath: string;
  detail: string;
  entries: AgentRosterEntry[];
}

// 从 agency-agents-zh 读取部门映射
const DEPARTMENT_MAP: Record<string, string> = {
  // 学术部
  "academic-anthropologist": "academic",
  "academic-geographer": "academic",
  "academic-historian": "academic",
  "academic-narratologist": "academic",
  "academic-psychologist": "academic",
  "academic-study-planner": "academic",
  // 设计部
  "design-ui-designer": "design",
  "design-ux-researcher": "design",
  "design-ux-architect": "design",
  "design-brand-guardian": "design",
  "design-image-prompt-engineer": "design",
  "design-visual-storyteller": "design",
  "design-whimsy-injector": "design",
  "design-inclusive-visuals-specialist": "design",
  // 工程部
  "engineering-frontend-developer": "engineering",
  "engineering-backend-architect": "engineering",
  "engineering-ai-engineer": "engineering",
  "engineering-devops-automator": "engineering",
  "engineering-security-engineer": "engineering",
  "engineering-rapid-prototyper": "engineering",
  "engineering-senior-developer": "engineering",
  "engineering-mobile-app-builder": "engineering",
  "engineering-data-engineer": "engineering",
  "engineering-technical-writer": "engineering",
  "engineering-autonomous-optimization-architect": "engineering",
  "engineering-embedded-firmware-engineer": "engineering",
  "engineering-embedded-linux-driver-engineer": "engineering",
  "engineering-fpga-digital-design-engineer": "engineering",
  "engineering-iot-solution-architect": "engineering",
  "engineering-incident-response-commander": "engineering",
  "engineering-threat-detection-engineer": "engineering",
  "engineering-solidity-smart-contract-engineer": "engineering",
  "engineering-wechat-mini-program-developer": "engineering",
  "engineering-code-reviewer": "engineering",
  "engineering-database-optimizer": "engineering",
  "engineering-git-workflow-master": "engineering",
  "engineering-software-architect": "engineering",
  "engineering-sre": "engineering",
  "engineering-ai-data-remediation-engineer": "engineering",
  "engineering-feishu-integration-developer": "engineering",
  "engineering-dingtalk-integration-developer": "engineering",
  "engineering-cms-developer": "engineering",
  "engineering-email-intelligence-engineer": "engineering",
  "engineering-filament-optimization-specialist": "engineering",
  "engineering-codebase-onboarding-engineer": "engineering",
  "engineering-minimal-change-engineer": "engineering",
  "engineering-voice-ai-integration-engineer": "engineering",
  "engineering-pc-host-engineer": "engineering",
  // 金融部
  "finance-bookkeeper-controller": "finance",
  "finance-financial-analyst": "finance",
  "finance-financial-forecaster": "finance",
  "finance-fpa-analyst": "finance",
  "finance-fraud-detector": "finance",
  "finance-investment-researcher": "finance",
  "finance-invoice-manager": "finance",
  "finance-tax-strategist": "finance",
  // 游戏开发部
  "game-designer": "game-development",
  "level-designer": "game-development",
  "narrative-designer": "game-development",
  "technical-artist": "game-development",
  "game-audio-engineer": "game-development",
  "unity-architect": "game-development",
  "unity-editor-tool-developer": "game-development",
  "unity-multiplayer-engineer": "game-development",
  "unity-shader-graph-artist": "game-development",
  "unreal-multiplayer-architect": "game-development",
  "unreal-systems-engineer": "game-development",
  "unreal-technical-artist": "game-development",
  "unreal-world-builder": "game-development",
  "blender-addon-engineer": "game-development",
  "godot-gameplay-scripter": "game-development",
  "godot-multiplayer-engineer": "game-development",
  "godot-shader-developer": "game-development",
  "roblox-systems-scripter": "game-development",
  "roblox-experience-designer": "game-development",
  "roblox-avatar-creator": "game-development",
  // 人力资源部
  "hr-recruiter": "hr",
  "hr-performance-reviewer": "hr",
  "hr-onboarding": "hr",
  // 法务部
  "legal-contract-reviewer": "legal",
  "legal-policy-writer": "legal",
  "legal-billing-time-tracking": "legal",
  "legal-client-intake": "legal",
  "legal-document-review": "legal",
  // 营销部
  "marketing-xiaohongshu-operator": "marketing",
  "marketing-douyin-strategist": "marketing",
  "marketing-wechat-operator": "marketing",
  "marketing-bilibili-strategist": "marketing",
  "marketing-kuaishou-strategist": "marketing",
  "marketing-china-ecommerce-operator": "marketing",
  "marketing-ecommerce-operator": "marketing",
  "marketing-baidu-seo-specialist": "marketing",
  "marketing-private-domain-operator": "marketing",
  "marketing-livestream-commerce-coach": "marketing",
  "marketing-cross-border-ecommerce": "marketing",
  "marketing-short-video-editing-coach": "marketing",
  "marketing-weibo-strategist": "marketing",
  "marketing-podcast-strategist": "marketing",
  "marketing-weixin-channels-strategist": "marketing",
  "marketing-knowledge-commerce-strategist": "marketing",
  "marketing-china-market-localization-strategist": "marketing",
  "marketing-daily-news-briefing": "marketing",
  "marketing-xiaohongshu-specialist": "marketing",
  "marketing-wechat-official-account": "marketing",
  "marketing-zhihu-strategist": "marketing",
  "marketing-tiktok-strategist": "marketing",
  "marketing-twitter-engager": "marketing",
  "marketing-instagram-curator": "marketing",
  "marketing-reddit-community-builder": "marketing",
  "marketing-app-store-optimizer": "marketing",
  "marketing-video-optimization-specialist": "marketing",
  "marketing-growth-hacker": "marketing",
  "marketing-content-creator": "marketing",
  "marketing-social-media-strategist": "marketing",
  "marketing-seo-specialist": "marketing",
  "marketing-carousel-growth-engine": "marketing",
  "marketing-linkedin-content-creator": "marketing",
  "marketing-book-co-author": "marketing",
  "marketing-agentic-search-optimizer": "marketing",
  "marketing-ai-citation-strategist": "marketing",
  // 付费媒体部
  "paid-media-auditor": "paid-media",
  "paid-media-creative-strategist": "paid-media",
  "paid-media-paid-social-strategist": "paid-media",
  "paid-media-ppc-strategist": "paid-media",
  "paid-media-programmatic-buyer": "paid-media",
  "paid-media-search-query-analyst": "paid-media",
  "paid-media-tracking-specialist": "paid-media",
  // 产品部
  "product-sprint-prioritizer": "product",
  "product-trend-researcher": "product",
  "product-feedback-synthesizer": "product",
  "product-behavioral-nudge-engine": "product",
  "product-manager": "product",
  // 项目管理部
  "project-manager-senior": "project-management",
  "project-management-project-shepherd": "project-management",
  "project-management-experiment-tracker": "project-management",
  "project-management-studio-producer": "project-management",
  "project-management-studio-operations": "project-management",
  "project-management-jira-workflow-steward": "project-management",
  // 销售部
  "sales-account-strategist": "sales",
  "sales-coach": "sales",
  "sales-deal-strategist": "sales",
  "sales-discovery-coach": "sales",
  "sales-engineer": "sales",
  "sales-outbound-strategist": "sales",
  "sales-pipeline-analyst": "sales",
  "sales-proposal-strategist": "sales",
  // 专项部
  "agents-orchestrator": "specialized",
  "prompt-engineer": "specialized",
  "agentic-identity-trust": "specialized",
  "data-consolidation-agent": "specialized",
  "lsp-index-engineer": "specialized",
  "report-distribution-agent": "specialized",
  "sales-data-extraction-agent": "specialized",
  "compliance-auditor": "specialized",
  "livestock-archive-auditor": "specialized",
  "accounts-payable-agent": "specialized",
  "identity-graph-operator": "specialized",
  "specialized-cultural-intelligence-strategist": "specialized",
  "specialized-developer-advocate": "specialized",
  "specialized-model-qa": "specialized",
  "blockchain-security-auditor": "specialized",
  "study-abroad-advisor": "specialized",
  "government-digital-presales-consultant": "specialized",
  "corporate-training-designer": "specialized",
  "specialized-mcp-builder": "specialized",
  "specialized-document-generator": "specialized",
  "specialized-workflow-architect": "specialized",
  "automation-governance-architect": "specialized",
  "specialized-salesforce-architect": "specialized",
  "healthcare-marketing-compliance": "specialized",
  "gaokao-college-advisor": "specialized",
  "specialized-pricing-optimizer": "specialized",
  "specialized-ai-policy-writer": "specialized",
  "specialized-risk-assessor": "specialized",
  "specialized-meeting-assistant": "specialized",
  "recruitment-specialist": "specialized",
  "specialized-civil-engineer": "specialized",
  "specialized-french-consulting-market": "specialized",
  "specialized-korean-business-navigator": "specialized",
  "healthcare-customer-service": "specialized",
  "hospitality-guest-services": "specialized",
  "language-translator": "specialized",
  "loan-officer-assistant": "specialized",
  "real-estate-buyer-seller": "specialized",
  "retail-customer-returns": "specialized",
  "specialized-chief-of-staff": "specialized",
  // 空间计算部
  "visionos-spatial-engineer": "spatial-computing",
  "macos-spatial-metal-engineer": "spatial-computing",
  "xr-interface-architect": "spatial-computing",
  "xr-immersive-developer": "spatial-computing",
  "xr-cockpit-interaction-specialist": "spatial-computing",
  "terminal-integration-specialist": "spatial-computing",
  // 供应链部
  "supply-chain-inventory-forecaster": "supply-chain",
  "supply-chain-vendor-evaluator": "supply-chain",
  "supply-chain-route-optimizer": "supply-chain",
  // 支持部
  "support-support-responder": "support",
  "support-analytics-reporter": "support",
  "support-legal-compliance-checker": "support",
  "support-executive-summary-generator": "support",
  "support-finance-tracker": "support",
  "support-infrastructure-maintainer": "support",
  "support-recruitment-specialist": "support",
  "support-supply-chain-strategist": "support",
  // 测试部
  "testing-evidence-collector": "testing",
  "testing-reality-checker": "testing",
  "testing-api-tester": "testing",
  "testing-performance-benchmarker": "testing",
  "testing-accessibility-auditor": "testing",
  "testing-test-results-analyzer": "testing",
  "testing-tool-evaluator": "testing",
  "testing-workflow-optimizer": "testing",
  "testing-embedded-qa-engineer": "testing",
};

// 读取 IDENTITY.md 文件获取中文名和描述
async function readIdentityFile(agentPath: string): Promise<{ displayName: string; description: string } | null> {
  const identityPath = join(agentPath, "IDENTITY.md");
  try {
    const content = await readFile(identityPath, "utf-8");
    const lines = content.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    if (lines.length === 0) return null;

    // 第一行是中文名（去掉 # 标题标记）
    let displayName = lines[0].replace(/^#\s*/, "").trim();
    // 第二行是描述
    const description = lines.slice(1).join(" ").trim();

    return { displayName, description };
  } catch {
    return null;
  }
}

export async function loadBestEffortAgentRoster(): Promise<AgentRosterSnapshot> {
  const homePath = resolveOpenClawHomePath();
  const sourcePath = resolveOpenClawConfigPath();
  const runtimeAgentsPath = join(homePath, "agents");
  const agencyAgentsPath = join(homePath, "agency-agents");
  const fromConfig = await loadCurrentAgentCatalog();
  
  if (fromConfig.entries.length > 0) {
    // 从配置读取时，也尝试读取 IDENTITY.md
    const entries: AgentRosterEntry[] = [];
    for (const entry of fromConfig.entries) {
      const identity = await readIdentityFile(join(agencyAgentsPath, entry.agentId));
      entries.push({
        agentId: entry.agentId,
        displayName: identity?.displayName || entry.displayName,
        description: identity?.description,
        department: DEPARTMENT_MAP[entry.agentId],
      });
    }
    return {
      status: "connected",
      sourcePath,
      detail: `${fromConfig.detail} 已从 IDENTITY.md 读取中文名和描述`,
      entries,
    };
  }

  const fromRuntime = await loadRosterFromRuntimeDirs(runtimeAgentsPath, agencyAgentsPath);
  const status = resolveMergedStatus(fromConfig.status, fromRuntime.status, fromRuntime.entries.length);
  const detail = `Config: ${fromConfig.detail} Runtime: ${fromRuntime.detail}`;

  return {
    status,
    sourcePath,
    detail,
    entries: fromRuntime.entries,
  };
}

async function loadRosterFromRuntimeDirs(runtimeAgentsPath: string, agencyAgentsPath: string): Promise<{
  status: AgentRosterStatus;
  detail: string;
  entries: AgentRosterEntry[];
}> {
  try {
    const dirEntries = await readdir(agencyAgentsPath, { withFileTypes: true });
    const entries: AgentRosterEntry[] = [];

    for (const entry of dirEntries) {
      if (!entry.isDirectory()) continue;
      
      const agentId = entry.name;
      const identity = await readIdentityFile(join(agencyAgentsPath, agentId));
      
      entries.push({
        agentId,
        displayName: identity?.displayName || agentId,
        description: identity?.description,
        department: DEPARTMENT_MAP[agentId],
      });
    }

    if (entries.length === 0) {
      // 回退到 runtime agents 目录
      return loadRosterFromRuntimeDirsLegacy(runtimeAgentsPath);
    }

    return {
      status: "connected",
      detail: `已从 agency-agents 加载 ${entries.length} 个角色（含中文名和部门）`,
      entries,
    };
  } catch {
    // 回退到 runtime agents 目录
    return loadRosterFromRuntimeDirsLegacy(runtimeAgentsPath);
  }
}

// 兼容旧的 runtime agents 目录
async function loadRosterFromRuntimeDirsLegacy(runtimeAgentsPath: string): Promise<{
  status: AgentRosterStatus;
  detail: string;
  entries: AgentRosterEntry[];
}> {
  try {
    const dirEntries = await readdir(runtimeAgentsPath, { withFileTypes: true });
    const entries: AgentRosterEntry[] = [];

    for (const entry of dirEntries) {
      if (!entry.isDirectory()) continue;
      
      const agentId = entry.name;
      const identity = await readIdentityFile(join(runtimeAgentsPath, agentId));
      
      entries.push({
        agentId,
        displayName: identity?.displayName || agentId,
        description: identity?.description,
        department: DEPARTMENT_MAP[agentId],
      });
    }

    if (entries.length === 0) {
      return {
        status: "partial",
        detail: "runtime agents directory found but empty.",
        entries: [],
      };
    }

    return {
      status: "connected",
      detail: `loaded ${entries.length} agent folder(s) from runtime.`,
      entries,
    };
  } catch (error) {
    if (isFsNotFound(error)) {
      return {
        status: "not_connected",
        detail: "runtime agents directory not found.",
        entries: [],
      };
    }
    return {
      status: "partial",
      detail: "runtime agents directory exists but could not be read.",
      entries: [],
    };
  }
}

function resolveMergedStatus(
  configStatus: AgentRosterStatus,
  runtimeStatus: AgentRosterStatus,
  totalEntries: number,
): AgentRosterStatus {
  if (totalEntries === 0) {
    return configStatus === "not_connected" && runtimeStatus === "not_connected"
      ? "not_connected"
      : "partial";
  }
  if (configStatus === "partial" || runtimeStatus === "partial") return "partial";
  return "connected";
}

function isFsNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string" &&
      (error as { code: string }).code === "ENOENT",
  );
}

// 获取所有部门列表（用于部门视图）
export async function getDepartmentList(): Promise<{ id: string; name: string; count: number }[]> {
  const roster = await loadBestEffortAgentRoster();
  const deptCount: Record<string, number> = {};
  
  for (const entry of roster.entries) {
    const dept = entry.department || "other";
    deptCount[dept] = (deptCount[dept] || 0) + 1;
  }

  const deptNames: Record<string, string> = {
    academic: "学术部",
    design: "设计部",
    engineering: "工程部",
    finance: "金融部",
    "game-development": "游戏开发部",
    hr: "人力资源部",
    legal: "法务部",
    marketing: "营销部",
    "paid-media": "付费媒体部",
    product: "产品部",
    "project-management": "项目管理部",
    sales: "销售部",
    specialized: "专项部",
    "spatial-computing": "空间计算部",
    "supply-chain": "供应链部",
    support: "支持部",
    testing: "测试部",
    other: "未分类",
  };

  return Object.entries(deptCount).map(([id, count]) => ({
    id,
    name: deptNames[id] || id,
    count,
  })).sort((a, b) => b.count - a.count);
}