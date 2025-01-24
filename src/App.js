import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClientesProvider } from './pages/ClientesContext'; // Provedor do contexto de clientes
import VendedorPage from './pages/VendedorPage'; // Página do vendedor
import RecepcaoPage from './pages/RecepcaoPage'; // Página da recepção

function App() {
  return (
    <ClientesProvider>
      <Router>
        <Routes>
          {/* Página inicial redireciona para a página do vendedor */}
          <Route path="/" element={<Navigate to="/vendedor" />} />

          {/* Página do vendedor */}
          <Route path="/vendedor" element={<VendedorPage />} />

          {/* Página da recepção */}
          <Route path="/recepcao" element={<RecepcaoPage />} />

          {/* Página 404 (rota inválida) */}
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </Router>
    </ClientesProvider>
  );
}

export default App;
