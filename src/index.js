// FILE: src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111c2e',
            color: '#e8edf5',
            border: '1px solid #1e2d45',
            fontFamily: 'Sora, sans-serif',
            fontSize: '0.85rem',
          },
          success: { iconTheme: { primary: '#10e090', secondary: '#111c2e' } },
          error:   { iconTheme: { primary: '#f04f5a', secondary: '#111c2e' } },
        }}
      />
    </BrowserRouter>
  </Provider>
);