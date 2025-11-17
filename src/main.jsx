import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import App from './App'
import './index.css'

// 配置 Apollo Client 连接到 Cloudflare Worker
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8787/graphql',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
