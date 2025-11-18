// app/comp-mcp-server/lib/safe-fs.ts
// 从 'fs' 主模块导入 'promises' (作为 fs) 和 'Dirent' / 'Stats' (类型)
import { promises as fs, Dirent, Stats } from 'fs';
import * as path from 'path';

/**
 * 安全的文件读取器，防止路径遍历攻击。
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
 * 安全的目录读取器，防止路径遍历。
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

/**
 * 安全的文件状态检查函数，防止路径遍历。
 * @param allowedBaseDir 允许读取的基础目录。
 * @param unsafeRelativePath 用户提供的子路径。
 * @returns 文件存在时返回 fs.Stats 对象。
 */
export async function safeStat(allowedBaseDir: string, unsafeRelativePath: string): Promise<Stats> {
  const fullPath = path.resolve(allowedBaseDir, unsafeRelativePath);

  // 安全检查：确保解析后的路径仍在允许的目录内
  if (!fullPath.startsWith(allowedBaseDir)) {
    throw new Error('Access denied: Path traversal detected.');
  }

  try {
    // 如果文件不存在，fs.stat 会抛出错误
    return await fs.stat(fullPath);
  } catch (error) {
    // 这个错误 (例如 ENOENT) 正是我们想要的验证结果
    throw new Error(`File not found or inaccessible: ${unsafeRelativePath}`);
  }
}
