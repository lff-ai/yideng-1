# 🚀 Web3 AI Chat Platform

> Full-stack AI Chat Platform powered by Cloudflare Workers, GraphQL & React

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://web3btc.win)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.9.0-e10098)](https://graphql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 📖 Overview

A modern full-stack AI chat platform built with serverless architecture, featuring real-time AI conversations powered by OpenAI GPT-3.5-turbo, GraphQL API, and deployed on Cloudflare's edge network.

**Live Demo**: [https://web3btc.win](https://web3btc.win)

## ✨ Features

- 🤖 **AI-Powered Conversations** - Integrated with OpenAI GPT-3.5-turbo for intelligent responses
- ⚡ **GraphQL API** - Type-safe API with complete schema definition
- 🌐 **Edge Computing** - Deployed on Cloudflare Workers for global low-latency access
- 📱 **Responsive UI** - Modern, dark-themed interface with gradient design
- 🔌 **MCP Integration** - Modular Component Platform for extensible services
- 🚀 **Serverless Architecture** - Zero server maintenance, auto-scaling

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Next-generation build tool
- **Apollo Client** - GraphQL client with caching
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Cloudflare Workers** - Serverless compute platform
- **GraphQL** - API query language
- **OpenAI API** - GPT-3.5-turbo integration

### Deployment
- **Cloudflare Pages** - Frontend hosting with automatic deployments
- **Cloudflare Workers** - Backend API hosting
- **GitHub Actions** - CI/CD pipeline

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                      https://web3btc.win                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/GraphQL
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Workers (Edge)                       │
│                  GraphQL Gateway                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   GraphQL    │───▶│   Resolver   │───▶│   OpenAI     │  │
│  │   Gateway    │    │    Logic     │    │     API      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/cwybruce/web3-ai-chat-platform.git
   cd web3-ai-chat-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your configuration
   ```

4. **Start development server**

   Frontend (Vite):
   ```bash
   npm run dev
   ```

   Backend (Wrangler):
   ```bash
   npm run dev:worker
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📦 Project Structure

```
web3-ai-chat-platform/
├── src/                    # Frontend React application
│   ├── App.jsx            # Main app component
│   ├── App.css            # Styling
│   └── main.jsx           # Entry point
├── worker/                 # Backend Worker code
│   └── index.js           # GraphQL API
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── wrangler.toml          # Worker configuration
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:8787/graphql
```

#### Backend (Cloudflare Dashboard)
```env
OPENAI_API_KEY=your_openai_api_key
```

## 🚢 Deployment

### Frontend (Cloudflare Pages)

The frontend is automatically deployed when pushing to the `main` branch:

1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variables configured in Cloudflare Dashboard

### Backend (Cloudflare Workers)

Deploy the Worker using Wrangler:

```bash
npm run deploy
# or
npx wrangler deploy
```

## 📝 API Documentation

### GraphQL Schema

```graphql
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
```

### Example Query

```graphql
mutation {
  chatWithAI(message: "Hello, tell me about Cloudflare Workers") {
    response
    model
    timestamp
  }
}
```

## 🖼️ Screenshots

### Main Interface
![Main Interface](./screenshots/main.png)

### AI Chat
![AI Chat Demo](./screenshots/chat.png)

### GraphQL Playground
![GraphQL Playground](./screenshots/playground.png)

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📈 Performance

- **Global CDN**: Deployed on Cloudflare's edge network
- **Low Latency**: < 50ms response time
- **Auto Scaling**: Handles traffic spikes automatically
- **Zero Cold Start**: Workers are always warm

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [OpenAI](https://openai.com/) - AI capabilities
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL client
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Contact

- **Website**: [https://web3btc.win](https://web3btc.win)
- **GitHub**: [@cwybruce](https://github.com/cwybruce)
- **Repository**: [web3-ai-chat-platform](https://github.com/cwybruce/web3-ai-chat-platform)

---

⭐ If you find this project useful, please consider giving it a star!
