import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  type Role = 'user' | 'assistant'
  type ChatMessage = { id: string; role: Role; content: string }
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm0', role: 'assistant', content: '你好，我是你的 AI 助手。有什么可以帮你？' },
  ])
  const chatBodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isSending) return
    setIsSending(true)
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // 模拟 AI 回复（实际接入可替换为 API 调用）
    await new Promise((r) => setTimeout(r, 600))
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: `我已收到你的消息：「${text}」。这是一个示例回复。`,
    }
    setMessages((prev) => [...prev, assistantMsg])
    setIsSending(false)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>AI 助手</span>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.content}
          </div>
        ))}
        {isSending && (
          <div className="message assistant">正在思考...</div>
        )}
      </div>
      <div className="chat-footer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入你的问题，按 Enter 发送"
        />
        <button onClick={sendMessage} disabled={isSending || !input.trim()}>
          发送
        </button>
      </div>
    </div>
  )
}

export default App
