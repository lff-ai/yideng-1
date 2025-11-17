/**
 * Cloudflare Worker with GraphQL API
 * 集成 AI (DeepSeek/OpenAI) 和 MCP 服务
 */

// GraphQL Schema 定义
const schema = `
  type Query {
    greeting: String!
    timestamp: String!
    mcpWeather: Weather
    mcpNews: News
  }

  type Mutation {
    chatWithAI(message: String!): ChatResponse!
  }

  type ChatResponse {
    response: String!
    model: String!
    timestamp: String!
  }

  type Weather {
    temperature: Float!
    condition: String!
    city: String!
  }

  type News {
    title: String!
    summary: String!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    greeting: () => "✅ Cloudflare Worker 连接成功！",
    timestamp: () => new Date().toISOString(),

    // MCP 天气服务示例
    mcpWeather: async () => {
      // 这里可以调用真实的天气 MCP 服务
      // 示例使用模拟数据
      return {
        temperature: 22.5,
        condition: "晴朗",
        city: "北京"
      };
    },

    // MCP 新闻服务示例
    mcpNews: async () => {
      // 这里可以调用真实的新闻 MCP 服务
      // 示例使用模拟数据
      return {
        title: "Web3 技术发展迅速",
        summary: "Cloudflare Workers 和边缘计算正在改变 Web 开发模式"
      };
    }
  },

  Mutation: {
    chatWithAI: async (_, { message }, context) => {
      const { env } = context;

      // 优先使用 DeepSeek API，如果不可用则使用 OpenAI
      let response;
      let model;

      try {
        if (env.DEEPSEEK_API_KEY) {
          response = await requestDeepSeekAPI(message, env.DEEPSEEK_API_KEY);
          model = "DeepSeek";
        } else if (env.OPENAI_API_KEY) {
          response = await requestOpenAI(message, env.OPENAI_API_KEY);
          model = "OpenAI";
        } else {
          // 如果没有配置 API Key，返回模拟响应
          response = `这是一个模拟响应。你说: "${message}"\n\n请在 wrangler.toml 中配置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY 以启用真实的 AI 对话。`;
          model = "Mock";
        }
      } catch (error) {
        response = `AI 调用失败: ${error.message}`;
        model = "Error";
      }

      return {
        response,
        model,
        timestamp: new Date().toISOString()
      };
    }
  }
};

import OpenAI from 'openai';
// DeepSeek API 调用
async function requestDeepSeekAPI(message, apiKey) {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey,
  });
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: 'user', content: message, }],
    model: "deepseek-chat",
  });

  return completion.choices[0].message.content;
}

// OpenAI API 调用
async function requestOpenAI(message, apiKey) {
  const client = new OpenAI({
    apiKey, // This is the default and can be omitted
  });

  const response = await client.responses.create({
    model: 'gpt-4o',
    instructions: 'You are a coding assistant that talks like a pirate',
    input: message,
  });

  return response.output_text;
}

// 简单的 GraphQL 执行器
async function executeGraphQL(query, variables, context) {
  // 解析查询类型
  const isQuery = query.includes('query');
  const isMutation = query.includes('mutation');

  // 提取操作名称
  let operationName = null;

  if (isQuery) {
    // Query 处理
    if (query.includes('GetGreeting')) {
      return {
        data: {
          greeting: resolvers.Query.greeting(),
          timestamp: resolvers.Query.timestamp()
        }
      };
    }

    if (query.includes('GetMCPData')) {
      return {
        data: {
          mcpWeather: await resolvers.Query.mcpWeather(),
          mcpNews: await resolvers.Query.mcpNews()
        }
      };
    }
  }

  if (isMutation && query.includes('chatWithAI')) {
    // 提取 message 参数（支持内联参数和 variables）
    let message = variables.message;

    // 如果 variables 中没有 message，尝试从查询字符串中提取
    if (!message) {
      const messageMatch = query.match(/message:\s*"([^"]*)"/);
      if (messageMatch) {
        message = messageMatch[1];
      }
    }

    const result = await resolvers.Mutation.chatWithAI(
      null,
      { message },
      context
    );
    return {
      data: {
        chatWithAI: result
      }
    };
  }

  return {
    errors: [{ message: '不支持的 GraphQL 操作' }]
  };
}

// CORS 头部 - 增强配置以支持 Apollo Client
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Apollo-Require-Preflight',
  'Access-Control-Max-Age': '86400', // 24 小时缓存预检请求
};

// Worker 主入口
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理 OPTIONS 预检请求（最高优先级，必须在任何逻辑之前）
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // GraphQL Endpoint
    if (url.pathname === '/graphql') {
      if (request.method === 'POST') {
        try {
          const { query, variables } = await request.json();

          const result = await executeGraphQL(query, variables || {}, { env });

          return new Response(JSON.stringify(result), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              errors: [{ message: error.message }]
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
      }

      // GraphQL Playground (GET 请求)
      if (request.method === 'GET') {
        return new Response(getPlaygroundHTML(), {
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders
          }
        });
      }
    }

    // 根路径 - 显示欢迎信息
    if (url.pathname === '/') {
      return new Response(
        JSON.stringify({
          message: '🚀 Web3 Journey Worker is running!',
          endpoints: {
            graphql: '/graphql',
            playground: '/graphql (GET)'
          },
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    return new Response('Not Found', { status: 404 });
  }
};

// GraphQL Playground HTML
function getPlaygroundHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GraphQL Playground</title>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #1a1a1a;
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .header {
      background: #2d2d2d;
      padding: 1rem 2rem;
      border-bottom: 2px solid #3b82f6;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .container {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }
    textarea {
      flex: 1;
      background: #2d2d2d;
      color: #fff;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 1rem;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      resize: none;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: #2563eb;
    }
    .examples {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
    .example {
      cursor: pointer;
      padding: 0.5rem;
      margin: 0.25rem 0;
      border-radius: 4px;
    }
    .example:hover {
      background: #3d3d3d;
    }
    pre {
      background: #1a1a1a;
      padding: 1rem;
      border-radius: 8px;
      overflow: auto;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 GraphQL Playground - Web3 Journey</h1>
  </div>
  <div class="container">
    <div class="panel">
      <h3>Query / Mutation</h3>
      <textarea id="query" placeholder="输入你的 GraphQL 查询...">
query GetGreeting {
  greeting
  timestamp
}</textarea>
      <button onclick="executeQuery()">执行查询</button>

      <div class="examples">
        <h4>示例查询:</h4>
        <div class="example" onclick="setQuery('greeting')">📡 基础查询</div>
        <div class="example" onclick="setQuery('mcp')">🔌 MCP 服务</div>
        <div class="example" onclick="setQuery('ai')">🤖 AI 聊天</div>
      </div>
    </div>

    <div class="panel">
      <h3>结果</h3>
      <pre id="result">等待执行查询...</pre>
    </div>
  </div>

  <script>
    const queries = {
      greeting: \`query GetGreeting {
  greeting
  timestamp
}\`,
      mcp: \`query GetMCPData {
  mcpWeather {
    temperature
    condition
    city
  }
  mcpNews {
    title
    summary
  }
}\`,
      ai: \`mutation ChatWithAI {
  chatWithAI(message: "你好！介绍一下 Cloudflare Workers") {
    response
    model
    timestamp
  }
}\`
    };

    function setQuery(type) {
      document.getElementById('query').value = queries[type];
    }

    async function executeQuery() {
      const query = document.getElementById('query').value;
      const resultEl = document.getElementById('result');

      resultEl.textContent = '执行中...';

      try {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });

        const result = await response.json();
        resultEl.textContent = JSON.stringify(result, null, 2);
      } catch (error) {
        resultEl.textContent = '错误: ' + error.message;
      }
    }
  </script>
</body>
</html>
  `;
}
