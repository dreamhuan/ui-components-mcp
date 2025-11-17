import fs from 'fs/promises';
import path from 'path';
import z from 'zod/v4';
import { StateGraph, START, END, MessagesZodMeta } from '@langchain/langgraph';
import { registry } from '@langchain/langgraph/zod';
import {
  AIMessage,
  MessageFieldWithRole,
  SystemMessage,
  ToolMessage,
  type BaseMessage,
} from '@langchain/core/messages';
import { embeddings, llmWithTools } from './llm';
import { toolsByName } from './tools';
import { v4 as uuidv4 } from 'uuid';

const MessagesState = z.object({
  messages: z.array(z.custom<BaseMessage>()).register(registry, MessagesZodMeta),
});

async function llmNode(state: z.infer<typeof MessagesState>) {
  console.log('=================llmNode=====================');

  const systemPrompt = `
  对于用户的提问，如果有合适的工具请调用工具后根据结果继续回答。
  'tavily_search'工具仅在用户明确有搜索需求或者你判断需要搜索网络内容来完善上下文时调用。
  `;
  return {
    messages: await llmWithTools.invoke([new SystemMessage(systemPrompt), ...state.messages]),
  };
}

async function toolNode(state: z.infer<typeof MessagesState>) {
  console.log('=================toolNode=====================');
  const lastMessage = state.messages.at(-1);

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    console.log('======toolCall\n', toolCall.name);
    const tool = toolsByName[toolCall.name];
    const observation = await tool!.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
}

async function toolsCondition(state: z.infer<typeof MessagesState>) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) return END;

  if (lastMessage.tool_calls?.length) {
    return 'toolNode';
  }

  return END;
}

const builder = new StateGraph(MessagesState)
  .addNode('llmNode', llmNode)
  .addNode('toolNode', toolNode)

  .addEdge(START, 'llmNode')
  .addConditionalEdges('llmNode', toolsCondition, ['toolNode', END])
  .addEdge('toolNode', 'llmNode');

export const graph = builder.compile();

export async function invokeGraph({
  messages,
  threadId = uuidv4(),
  userId = 'cmhbgrxn20000fbb0jbfq2ccl',
}: {
  messages: MessageFieldWithRole[];
  threadId?: string;
  userId?: string;
}) {
  console.log('======current threadId\n', threadId);
  const config = {
    configurable: {
      thread_id: threadId,
      userId,
    },
  };

  const result = await graph.invoke(
    {
      messages,
    },
    config
  );
  return result;
}
