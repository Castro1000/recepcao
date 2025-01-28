import React, { useContext, useEffect } from 'react';
import './RecepcaoPage.css';
import ClientesContext from './ClientesContext';

function RecepcaoPage() {
  const { clientes, error, carroFinalizado, showModal, setShowModal } = useContext(ClientesContext);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 40000); // O modal desaparece após 40 segundos
      return () => clearTimeout(timer);
    }
  }, [showModal, setShowModal]);

  return (
    <div className="recepcao-container">
      <header className="header">
  <div className="logo-marcas-container">
    <div className="logo-marcas-wrapper">
      {/* Duplicamos as imagens para evitar espaços vazios */}
      {[...Array(2)].map((_, i) => (
        <React.Fragment key={i}>
          <img src="/dunloplogo.png" alt="Marca 1" className="logo-marca" />
          <img src="/logo.png" alt="Marca 2" className="logo-marca" />
          <img src="/speed.png" alt="Marca 3" className="logo-marca" />
          <img src="/triangle.png" alt="Marca 4" className="logo-marca" />
          <img src="/xbri.png" alt="Marca 5" className="logo-marca" />
        </React.Fragment>
      ))}
    </div>
  </div>
</header>


      <div className="main-content">
        <div className="video-container">
          {!showModal && (
            <video
              id="video"
              className="video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="video.mp4" type="video/mp4" />
              Seu navegador não suporta o vídeo.
            </video>
          )}
          {showModal && (
            <>
              <div className="modal-overlay"></div> {/* Fundo escuro ao ativar modal */}
              <div className="car-finalizado">
                <h2>🚗 CARRO FINALIZADO! 🚗</h2>
                <p><strong>Modelo:</strong> {carroFinalizado.modelo}</p>
                <p><strong>Placa:</strong> {carroFinalizado.placa}</p>
                <p><strong>Cor:</strong> {carroFinalizado.cor}</p>
              </div>
            </>
          )}
        </div>

        {/* Lista de carros em atendimento */}
        <div className="side-columns">
          <div className="column carros">
            <div className="logo-carros-container">
              <img src="/pneu.png" alt="Logo" className="logo-carros" />
            </div>
            <h2>Carros em Atendimento</h2>
            <ul>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {clientes.length > 0 ? (
                clientes.map((cliente, index) => (
                  <li
                    key={index}
                    className="car-item"
                    style={{ backgroundColor: cliente.cor }}
                  >
                    {cliente.modelo} - {cliente.placa.slice(-4)} - {cliente.cor}
                    <span className="andamento"> EM ANDAMENTO</span>
                  </li>
                ))
              ) : (
                <li>Sem carros cadastrados.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="message">
          <p className="bemvindo">SEJAM BEM-VINDOS!</p>
        </div>
      </footer>
    </div>
  );
}

export default RecepcaoPage;
