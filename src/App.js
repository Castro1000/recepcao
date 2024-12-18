import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientesProvider } from './pages/ClientesContext';  // Importe o ClientesProvider
import VendedorPage from './pages/VendedorPage';
import RecepcaoPage from './pages/RecepcaoPage';

function App() {
  return (
    <ClientesProvider>  {/* Envolva sua aplicação com o ClientesProvider */}
      <Router>
        <Routes>
          {/* Rota para o vendedor */}
          <Route path="/vendedor" element={<VendedorPage />} />

          {/* Rota para a recepção */}
          <Route path="/recepcao" element={<RecepcaoPage />} />

          {/* Página padrão ou 404 */}
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </Router>
    </ClientesProvider>
  );
}

export default App;
