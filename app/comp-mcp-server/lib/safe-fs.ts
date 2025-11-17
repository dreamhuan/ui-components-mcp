// app/comp-mcp-server/lib/safe-fs.ts
import { promises as fs, Dirent } from 'fs';
import * as path from 'path';

/**
 * A secure file reader that prevents path traversal attacks.
 * It ensures the requested file is *within* the allowed base directory.
 * (一个安全的文件读取器，防止路径遍历攻击。它确保请求的文件位于允许的基础目录内。)
 * @param allowedBaseDir The directory reading is confined to.
 * @param unsafeRelativePath The user-provided sub-path.
 * @returns The content of the file.
 */
export async function safeReadFile(
  allowedBaseDir: string,
  unsafeRelativePath: string
): Promise<string> {
  // Resolve the full path
  const fullPath = path.resolve(allowedBaseDir, unsafeRelativePath);

  // Security Check: Ensure the resolved path is still inside the allowed directory
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
 * @param allowedBaseDir The directory reading is confined to.
 *Services
 * @param unsafeRelativePath The user-provided sub-path.
 * @returns A list of directory entry names.
 */
export async function safeReadDir(
  allowedBaseDir: string,
  unsafeRelativePath: string = ''
): Promise<Dirent[]> {
  // This type 'Dirent' is now correctly imported
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
