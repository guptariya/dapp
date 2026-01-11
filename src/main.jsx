import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Error boundary for better error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

// Ensure root element exists
const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: white; text-align: center;"><h1>Error: Root element not found</h1></div>'
} else {
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; color: white; text-align: center; background: linear-gradient(135deg, #0d0b1a 0%, #151225 50%, #1e1a35 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #f59e0b; margin-bottom: 1rem;">Error Loading App</h1>
        <p style="color: #c4b5fd; margin-bottom: 1rem;">${error.message}</p>
        <p style="color: #c4b5fd;">Check the browser console for more details.</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 12px 24px; background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
          Reload Page
        </button>
      </div>
    `
  }
}
