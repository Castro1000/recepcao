import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VendedorPage.css';

function VendedorPage() {
  const [formData, setFormData] = useState({
    modelo: '',
    placa: '',
    cor: '',
  });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // Função para buscar os carros cadastrados na fila de atendimento
  const fetchCarros = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar carros cadastrados:', error);
      setError('Erro ao buscar carros cadastrados. Tente novamente mais tarde.');
    } finally {
      setIsFetching(false);
    }
  };

  // Inicializa os dados ao carregar a página
  useEffect(() => {
    fetchCarros();
  }, []);

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submissão do formulário para cadastrar um carro
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/atendimentos', formData);
      alert('Carro cadastrado com sucesso!');
      setFormData({ modelo: '', placa: '', cor: '' });
      fetchCarros();
      setError(null);
    } catch (error) {
      console.error('Erro ao cadastrar o carro:', error);
      setError('Erro ao cadastrar o carro. Tente novamente.');
    }
  };

  // Função para finalizar um atendimento e executar ações adicionais
  const handleFinalizarServico = async (clienteId, modelo, placa, cor) => {
    console.log('Finalizando serviço para o cliente com ID:', clienteId);

    if (!clienteId) {
      alert('ID do cliente não encontrado!');
      return;
    }

    if (window.confirm('Você tem certeza que deseja finalizar o atendimento?')) {
      try {
        await axios.put(`http://localhost:3001/api/clientes/finalizar/${clienteId}`);
        alert('Serviço finalizado com sucesso!');

        // Reproduzir os áudios na sequência
        const audioCampainha = new Audio('/campainha.mp3');
        const audioVoz = new Audio('/voz.mp3');

        let playVoiceCount = 0;

        const playVoice = () => {
          if (playVoiceCount < 1) {
            audioVoz.play();
            playVoiceCount++;
            audioVoz.onended = playVoice; // Reproduz novamente até completar
          } else {
            // Após os áudios, chama a função de leitura dos dados
            speakCarData(modelo, placa, cor);
          }
        };

        audioCampainha.play();
        audioCampainha.onended = playVoice;

        // Atualiza o estado do cliente como finalizado
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.ID === clienteId ? { ...cliente, finalizado: true } : cliente
          )
        );
      } catch (error) {
        console.error('Erro ao finalizar o serviço:', error);
        setError('Erro ao finalizar o serviço. Tente novamente.');
      }
    }
  };

  // Função para falar os dados do carro usando Web Speech API
  const speakCarData = (modelo, placa, cor) => {
    const speech1 = new SpeechSynthesisUtterance();

    // Formata a placa separando letras e números
    const formatPlaca = (placa) => {
      return placa.split('').map((char) => (isNaN(char) ? char : char)).join(', ');
    };

    const placaFormatada = formatPlaca(placa);

    speech1.text = `Carro: Modelo ${modelo}, Placa ${placaFormatada}, Cor ${cor}.`;
    speech1.lang = 'pt-BR';
    speech1.volume = 5;
    speech1.rate = 1;
    speech1.pitch = 1;

    const speech2 = new SpeechSynthesisUtterance();
    speech2.text = `Carro: Modelo ${modelo}, Placa ${placaFormatada}, Cor ${cor}.`;
    speech2.lang = 'pt-BR';
    speech2.volume = 1;
    speech2.rate = 1;
    speech2.pitch = 1;

    speech1.onend = () => {
      window.speechSynthesis.speak(speech2);
    };

    speech2.onend = () => {
      const audio = new Audio('/dirijase.mp3');
      audio.play();
    };

    window.speechSynthesis.speak(speech1);
  };

  return (
    <div className="vendedor-container2">
      <div className="content2">
        {/* Tela de Cadastro */}
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
            <br />
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
            <br />
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
            <br />
            <button className="btn2" type="submit">
              Cadastrar
            </button>
          </form>
        </div>

        {/* Tela de Fila de Atendimento */}
        <div className="fila-container2">
          <h1 className="filade">Fila de Atendimento</h1>
          {isFetching ? (
            <p>Carregando carros...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
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
            <p className="fil">Sem carros na fila de atendimento.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendedorPage;
