// app/comp-mcp-server/lib/paths.ts
import * as path from 'path';

// --- 'design-system' 仓库的基础路径 ---
// 所有路径均从用户的主目录安全解析
export const DESIGN_SYSTEM_PATH = path.resolve(process.env.HOME || '~', 'workspace/vibe/design-system');
export const UI_SRC_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/ui/src');
export const ICON_ASSETS_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/icons/src/assets');
export const TOKEN_DATA_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/token/src/assets/data');
export const PACKAGES_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages');
export const DOCS_CONTENT_PATH = path.join(DESIGN_SYSTEM_PATH, 'apps/docs/content/docs');
export const DEMO_PATH = path.join(DESIGN_SYSTEM_PATH, 'apps/docs/demo');

// --- 新增路径 (Radix 文档) ---
// 该路径指向 design-system 仓库之外，这是符合预期的。
export const RADIX_DOCS_PATH = path.resolve(
  process.env.HOME || '~',
  'workspace/vibe/website/data/primitives/docs/components'
);
