import 'dotenv/config';
import { invokeGraph } from './agent';

main();

async function main() {
  const input = '杭州有什么好玩的？';
  const messages = [{ role: 'user', content: input }];

  const result = await invokeGraph({ messages });

  console.log('================= output =====================');
  console.log('======messages:\n', result.messages);

  const content = result.messages.at(-1)?.content;
  console.log('======content:\n', content);
}
