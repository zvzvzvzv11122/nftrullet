import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// IMPORTANT: Ensure your `tonconnect-manifest.json` is publicly accessible from the root of your application.
// For local development, if your app runs on http://localhost:3000, the manifest should be at http://localhost:3000/tonconnect-manifest.json
// Adjust the manifestUrl if your development server serves it from a different path or if your app is in a subfolder.
const manifestUrl = new URL('tonconnect-manifest.json', window.location.origin).toString();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);