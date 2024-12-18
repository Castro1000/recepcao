import React, { useContext, useEffect, useState } from 'react';
import './RecepcaoPage.css';
import ClientesContext from './ClientesContext';

function RecepcaoPage() {
  const { clientes, error } = useContext(ClientesContext);
  const [carrosEmServico, setCarrosEmServico] = useState([]);
  const [carroFinalizado, setCarroFinalizado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalAnimacao, setModalAnimacao] = useState(false);

  useEffect(() => {
    setCarrosEmServico(clientes);
  }, [clientes]);

  const finalizarCarro = (cliente) => {
    setCarroFinalizado(cliente);
    setMostrarModal(true);
    setModalAnimacao(true);

    setTimeout(() => {
      setMostrarModal(false);
      setModalAnimacao(false);
      setCarrosEmServico((prevCarros) =>
        prevCarros.filter((carro) => carro !== cliente)
      );
    }, 2000);
  };

  return (
    <div className="recepcao-container">
      <header className="header">
        <h1 className="nome-logo">BEM-VINDO</h1>
      </header>

      <div className="main-content">
        {/* Vídeo começa automaticamente */}
        <div className="video-container">
          <video
            id="video"
            className="video"
            autoPlay
            muted
            loop
            playsInline // Importante para dispositivos móveis
          >
            <source src="video.mp4" type="video/mp4" />
            Seu navegador não suporta o vídeo.
          </video>
        </div>

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
                    className={`car-item ${
                      cliente === carroFinalizado ? 'finalizado' : ''
                    }`}
                    style={{ backgroundColor: cliente.cor }}
                    onClick={() => finalizarCarro(cliente)}
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

      {mostrarModal && (
        <div className={`modal ${modalAnimacao ? 'animacao' : ''}`}>
          <h2>Agora é a sua vez!</h2>
          <p>
            {carroFinalizado.modelo} - {carroFinalizado.placa} está pronto!
          </p>
        </div>
      )}

      <footer className="footer">
        <div className="message">
          <p className="bemvindo">SEJA BEM-VINDO!</p>
        </div>
      </footer>
    </div>
  );
}

export default RecepcaoPage;
