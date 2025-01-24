import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VendedorPage.css';

function VendedorPage() {
  const [formData, setFormData] = useState({ modelo: '', placa: '', cor: '' });
  const [clientes, setClientes] = useState([]);
  const [carroFinalizado, setCarroFinalizado] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchCarros = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
      setError(null);
    } catch (error) {
      setError('Erro ao buscar carros cadastrados. Tente novamente mais tarde.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCarros();
  }, []);

  useEffect(() => {
    if (carroFinalizado) {
      const timer = setTimeout(() => {
        setCarroFinalizado(null);
      }, 40000); // 40 segundos
      return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado
    }
  }, [carroFinalizado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/atendimentos', formData);
      alert('Carro cadastrado com sucesso!');
      setFormData({ modelo: '', placa: '', cor: '' });
      fetchCarros();
      setError(null);
    } catch (error) {
      setError('Erro ao cadastrar o carro. Tente novamente.');
    }
  };

  const handleFinalizarServico = async (clienteId, modelo, placa, cor) => {
    if (!clienteId) {
      alert('ID do cliente não encontrado!');
      return;
    }

    if (window.confirm('Você tem certeza que deseja finalizar o atendimento?')) {
      try {
        await axios.put(`http://localhost:3001/api/clientes/finalizar/${clienteId}`);
        alert('Serviço finalizado com sucesso!');
        setCarroFinalizado({ modelo, placa, cor });
        const audioCampainha = new Audio('/campainha.mp3');
        const audioVoz = new Audio('/voz.mp3');
        let playVoiceCount = 0;

        const playVoice = () => {
          if (playVoiceCount < 1) {
            audioVoz.play();
            playVoiceCount++;
            audioVoz.onended = playVoice;
          } else {
            speakCarData(modelo, placa, cor);
          }
        };

        audioCampainha.play();
        audioCampainha.onended = playVoice;

        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.ID === clienteId ? { ...cliente, finalizado: true } : cliente
          )
        );
      } catch (error) {
        setError('Erro ao finalizar o serviço. Tente novamente.');
      }
    }
  };

  const speakCarData = (modelo, placa, cor) => {
    const speech1 = new SpeechSynthesisUtterance();
    speech1.text = `Carro: Modelo ${modelo}, Placa ${placa}, Cor ${cor}.`;
    speech1.lang = 'pt-BR';
    speech1.onend = () => {
      const audio = new Audio('/dirijase.mp3');
      audio.play();
    };
    window.speechSynthesis.speak(speech1);
  };

  return (
    <div className="vendedor-container2">
      <div className="content2">
        <div className="form-container2">
          <h2 className="cad2">Cadastro de Carro</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="mod2">
              Modelo:
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
              />
            </label>
            <label className="mod2">
              Placa:
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                required
              />
            </label>
            <label className="mod2">
              Cor:
              <input
                type="text"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                required
              />
            </label>
            <button className="btn2" type="submit">
              Cadastrar
            </button>
          </form>
        </div>

        <div className="fila-container2">
          <h1 className="filade">Fila de Atendimento</h1>
          {isFetching ? (
            <p>Carregando carros...</p>
          ) : clientes.length > 0 ? (
            <ul>
              {clientes.map((cliente) =>
                !cliente.finalizado && (
                  <li key={cliente.ID} className="cliente-item">
                    {cliente.modelo} - {cliente.placa} - {cliente.cor}
                    <button
                      className="finalizar-btn"
                      onClick={() =>
                        handleFinalizarServico(cliente.ID, cliente.modelo, cliente.placa, cliente.cor)
                      }
                    >
                      Finalizar
                    </button>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>Sem carros na fila de atendimento.</p>
          )}
        </div>
      </div>

      {carroFinalizado && (
        <div className="car-finalizado">
          <h2>CARRO FINALIZADO!</h2>
          <p>Modelo: {carroFinalizado.modelo}</p>
          <p>Placa: {carroFinalizado.placa}</p>
          <p>Cor: {carroFinalizado.cor}</p>
        </div>
      )}
    </div>
  );
}

export default VendedorPage;
