import 'dotenv/config';
import { invokeGraph } from './agent';

main();

async function main() {
  const input = '帮我生成一个简单的登录组件，使用React、TypeScript和tailwind css编写。';
  const messages = [{ role: 'user', content: input }];

  const result = await invokeGraph({ messages });

  console.log('================= output =====================');
  console.log('======messages:\n', result.messages);

  const content = result.messages.at(-1)?.content;
  console.log('======content:\n', content);
}
