import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Conectar ao WebSocket do backend

const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [carroFinalizado, setCarroFinalizado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Buscar os clientes cadastrados na fila de atendimento
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao buscar os carros cadastrados. Tente novamente mais tarde.');
    }
  };

  // Função chamada quando um carro é finalizado
  const finalizarCarro = (carro) => {
    setCarroFinalizado(carro);
    setShowModal(true); // Exibe o modal

    // Remover o carro finalizado da lista de atendimento
    setClientes((prevClientes) => prevClientes.filter(c => c.id !== carro.id));

    // Esconder o modal após 40 segundos
    setTimeout(() => {
      setShowModal(false);
      setCarroFinalizado(null);
    }, 40000);
  };

  useEffect(() => {
    fetchClientes(); // Buscar a lista de clientes ao carregar a página

    // Atualizar a lista de clientes a cada 10 segundos
    const interval = setInterval(() => {
      fetchClientes();
    }, 10000);

    // Escutar evento do WebSocket quando um carro for finalizado
    socket.on('carroFinalizado', (carro) => {
      console.log('Carro finalizado recebido:', carro);
      finalizarCarro(carro);
    });

    return () => {
      clearInterval(interval);
      socket.off('carroFinalizado'); // Remover o listener ao desmontar
    };
  }, []);

  return (
    <ClientesContext.Provider value={{
      clientes,
      error,
      finalizarCarro,
      carroFinalizado,
      showModal,
      setShowModal,
    }}>
      {children}
    </ClientesContext.Provider>
  );
};

export default ClientesContext;
