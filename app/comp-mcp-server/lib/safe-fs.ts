// app/comp-mcp-server/lib/safe-fs.ts
// Import 'promises' as fs, and 'Dirent' / 'Stats' (types) from the main 'fs' module
import { promises as fs, Dirent, Stats } from 'fs';
import * as path from 'path';

/**
 * A secure file reader that prevents path traversal attacks.
 * (一个安全的文件读取器，防止路径遍历攻击。)
 */
export async function safeReadFile(
  allowedBaseDir: string,
  unsafeRelativePath: string
): Promise<string> {
  const fullPath = path.resolve(allowedBaseDir, unsafeRelativePath);

  if (!fullPath.startsWith(allowedBaseDir)) {
    throw new Error('Access denied: Path traversal detected.');
  }

  try {
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error) {
    console.error(`[MCP Error] Failed to read file: ${fullPath}`, error);
    throw new Error(`File not found or unreadable: ${unsafeRelativePath}`);
  }
}

/**
 * A secure directory lister that prevents path traversal.
 * (一个安全的目录读取器，防止路径遍历。)
 */
export async function safeReadDir(
  allowedBaseDir: string,
  unsafeRelativePath: string = ''
): Promise<Dirent[]> {
  const fullPath = path.resolve(allowedBaseDir, unsafeRelativePath);

  if (!fullPath.startsWith(allowedBaseDir)) {
    throw new Error('Access denied: Path traversal detected.');
  }

  try {
    return await fs.readdir(fullPath, { withFileTypes: true });
  } catch (error) {
    console.error(`[MCP Error] Failed to read dir: ${fullPath}`, error);
    throw new Error(`Directory not found or unreadable: ${unsafeRelativePath}`);
  }
}

// --- NEW FUNCTION (新增函数) ---

/**
 * A secure file stat function that prevents path traversal.
 * (一个安全的文件状态检查函数，防止路径遍历。)
 * @param allowedBaseDir The directory reading is confined to.
 * @param unsafeRelativePath The user-provided sub-path.
 * @returns fs.Stats object if the file exists.
 */
export async function safeStat(allowedBaseDir: string, unsafeRelativePath: string): Promise<Stats> {
  const fullPath = path.resolve(allowedBaseDir, unsafeRelativePath);

  // Security Check: Ensure the resolved path is still inside the allowed directory
  if (!fullPath.startsWith(allowedBaseDir)) {
    throw new Error('Access denied: Path traversal detected.');
  }

  try {
    // fs.stat will throw an error if the file doesn't exist
    return await fs.stat(fullPath);
  } catch (error) {
    // This error (e.g., ENOENT) is the validation we want
    throw new Error(`File not found or inaccessible: ${unsafeRelativePath}`);
  }
}
