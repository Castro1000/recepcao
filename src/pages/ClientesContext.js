import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [audioToPlay, setAudioToPlay] = useState(null);
  const [carroFinalizado, setCarroFinalizado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao buscar os carros cadastrados. Tente novamente mais tarde.');
    }
  };

  const tocarAudio = () => {
    const audio = new Audio('/voz.mp3');
    setAudioToPlay(audio);
  };

  const finalizarCarro = (carro) => {
    setCarroFinalizado(carro);
    setShowModal(true); // Exibe o modal
    tocarAudio();
  };

  useEffect(() => {
    fetchClientes();
    const interval = setInterval(() => {
      fetchClientes();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ClientesContext.Provider value={{ 
      clientes, 
      error, 
      fetchClientes, 
      audioToPlay, 
      tocarAudio, 
      finalizarCarro, 
      carroFinalizado, 
      showModal, 
      setShowModal 
    }}>
      {children}
    </ClientesContext.Provider>
  );
};

export default ClientesContext;
