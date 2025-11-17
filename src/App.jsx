import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import './App.css'

// GraphQL 查询
const GET_GREETING = gql`
  query GetGreeting {
    greeting
    timestamp
  }
`

// GraphQL Mutation - AI 聊天
const CHAT_WITH_AI = gql`
  mutation ChatWithAI($message: String!) {
    chatWithAI(message: $message) {
      response
      model
      timestamp
    }
  }
`

// GraphQL Query - MCP 服务示例
const GET_MCP_DATA = gql`
  query GetMCPData {
    mcpWeather {
      temperature
      condition
      city
    }
    mcpNews {
      title
      summary
    }
  }
`

function App() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  // 查询基础信息
  const { data: greetingData, loading: greetingLoading } = useQuery(GET_GREETING)

  // 查询 MCP 数据
  const { data: mcpData, loading: mcpLoading } = useQuery(GET_MCP_DATA)

  // AI 聊天 Mutation
  const [chatWithAI, { loading: chatLoading }] = useMutation(CHAT_WITH_AI, {
    onCompleted: (data) => {
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: data.chatWithAI.response, model: data.chatWithAI.model }
      ])
      setMessage('')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      chatWithAI({ variables: { message } })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Web3 Journey - AI Chat Platform</h1>
        <p>Cloudflare Workers + React + GraphQL + AI Integration</p>
      </header>

      <div className="container">
        {/* 欢迎信息 */}
        <section className="welcome-section">
          <h2>📡 Worker 连接状态</h2>
          {greetingLoading ? (
            <p>连接中...</p>
          ) : greetingData ? (
            <div className="status-card">
              <p>✅ {greetingData.greeting}</p>
              <p className="timestamp">时间: {greetingData.timestamp}</p>
            </div>
          ) : (
            <p>❌ 连接失败</p>
          )}
        </section>

        {/* MCP 服务展示 */}
        <section className="mcp-section">
          <h2>🔌 MCP 服务示例</h2>
          {mcpLoading ? (
            <p>加载中...</p>
          ) : mcpData ? (
            <div className="mcp-grid">
              {mcpData.mcpWeather && (
                <div className="mcp-card">
                  <h3>🌤️ 天气信息</h3>
                  <p>城市: {mcpData.mcpWeather.city}</p>
                  <p>温度: {mcpData.mcpWeather.temperature}°C</p>
                  <p>状况: {mcpData.mcpWeather.condition}</p>
                </div>
              )}
              {mcpData.mcpNews && (
                <div className="mcp-card">
                  <h3>📰 新闻资讯</h3>
                  <p><strong>{mcpData.mcpNews.title}</strong></p>
                  <p>{mcpData.mcpNews.summary}</p>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* AI 聊天界面 */}
        <section className="chat-section">
          <h2>🤖 AI 聊天 (DeepSeek/OpenAI)</h2>

          <div className="chat-history">
            {chatHistory.length === 0 ? (
              <p className="empty-state">开始与 AI 对话吧！</p>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-header">
                    {msg.role === 'user' ? '👤 你' : '🤖 AI'}
                    {msg.model && <span className="model-badge">{msg.model}</span>}
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="message assistant">
                <div className="message-header">🤖 AI</div>
                <div className="message-content typing">思考中...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入你的问题..."
              disabled={chatLoading}
              className="chat-input"
            />
            <button type="submit" disabled={chatLoading || !message.trim()} className="chat-button">
              {chatLoading ? '发送中...' : '发送'}
            </button>
          </form>
        </section>
      </div>

      <footer className="App-footer">
        <p>Powered by Cloudflare Workers • GraphQL • React</p>
        <p>
          <a href="https://github.com/cwybruce/web3-journey-80" target="_blank" rel="noopener noreferrer">
            📦 GitHub Repository
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
