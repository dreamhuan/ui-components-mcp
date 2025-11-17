import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { tools } from './tools';

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;
const model = process.env.OPENAI_MODEL;

export const llm = new ChatOpenAI({
  model,
  configuration: {
    baseURL,
    apiKey,
  },
});

// 输出维度为1024
export const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-v4',
  configuration: {
    baseURL,
    apiKey,
  },
});
// export const embeddings = new OpenAIEmbeddings({
//   model: 'BAAI/bge-m3',
//   configuration: {
//     baseURL: 'https://api.siliconflow.cn/v1/',
//     apiKey: process.env.SILICONFLOW_API_KEY,
//   },
// });

export const llmWithTools = llm.bindTools(tools);
