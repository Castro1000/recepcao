import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importar o CSS global, caso necessário
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
