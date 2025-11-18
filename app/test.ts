import 'dotenv/config';
import { invokeGraph } from './agent';

import path, { dirname } from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// 获取当前文件的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

main();

async function main() {
  const buf = await fs.promises.readFile(path.resolve(__dirname, './prompt.en.md'));
  const systemPrompt = buf.toString();

  const input = '帮我生成一个简单的登录组件，使用React、TypeScript和tailwind css编写。使用vibeus组件库，只需要实现ui，不需要使用form';
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: input },
  ];

  const result = await invokeGraph({ messages });

  console.log('================= output =====================');
  console.log('======messages:\n', result.messages);

  const content = result.messages.at(-1)?.content;
  console.log('======content:\n', content);
}
