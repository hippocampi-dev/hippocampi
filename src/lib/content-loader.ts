import fs from 'fs';
import path from 'path';

/**
 * Loads markdown content from a file
 */
export async function loadMarkdownContent(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    const content = await fs.promises.readFile(fullPath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error loading markdown content from ${filePath}:`, error);
    return `Error loading content: ${(error as Error).message}`;
  }
}

/**
 * Loads multiple markdown files and returns them as a map
 */
export async function loadMultipleMarkdownFiles(files: Record<string, string>): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  
  for (const [key, filePath] of Object.entries(files)) {
    result[key] = await loadMarkdownContent(filePath);
  }
  
  return result;
}
