// app/comp-mcp-server/lib/paths.ts
import * as path from 'path';

// --- Base Paths for the 'design-system' monorepo ---
// All paths are resolved securely from the user's home directory
export const DESIGN_SYSTEM_PATH = path.resolve(process.env.HOME || '~', 'workspace/vibe/design-system');
export const UI_SRC_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/ui/src');
export const ICON_ASSETS_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/icons/src/assets');
export const TOKEN_DATA_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/token/src/assets/data');
export const PACKAGES_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages');
export const DOCS_CONTENT_PATH = path.join(DESIGN_SYSTEM_PATH, 'apps/docs/content/docs');
export const DEMO_PATH = path.join(DESIGN_SYSTEM_PATH, 'apps/docs/demo');

// --- NEW PATH (新增路径 - Radix Docs) ---
// This path points *outside* the design-system repo, which is intended.
// (此路径指向 design-system 仓库 *外部*，这是符合预期的。)
export const RADIX_DOCS_PATH = path.resolve(
  process.env.HOME || '~',
  'workspace/vibe/website/data/primitives/docs/components'
);
