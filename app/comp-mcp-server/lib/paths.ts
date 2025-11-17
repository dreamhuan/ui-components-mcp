// app/comp-mcp-server/lib/paths.ts
import * as path from 'path';

// --- Base Paths for the 'design-system' monorepo ---
// All paths are resolved securely from the user's home directory
export const DESIGN_SYSTEM_PATH = path.resolve(process.env.HOME || '~', 'workspace/design-system');
export const UI_SRC_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/ui/src');
export const ICON_ASSETS_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/icons/src/assets');
export const TOKEN_DATA_PATH = path.join(DESIGN_SYSTEM_PATH, 'packages/token/src/assets/data');