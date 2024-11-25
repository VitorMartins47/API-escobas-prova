import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://backend-aula.vercel.app';

const containerStyle = {
  background: "linear-gradient( #D12229, #FF8C00)",
  color: "#000000",
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
  width: "90%",
  maxWidth: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ddd",
  fontSize: "16px",
};

const buttonStyle = {
  width: "48%",
  padding: "12px",
  margin: "10px 1%",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  background: "#009FFD",
  color: "#fff",
  fontSize: "16px",
  transition: "background 0.3s",
};

const messageStyle = {
  margin: "10px 0",
  color: "lightgrey",
  fontWeight: "bold",
};

const Header = ({ onLogout }) => {
  const location = useLocation();

  const rotasSemHeader = ["/login", "/registro"];

  if (rotasSemHeader.includes(location.pathname)) {
    return null;
  }

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #FF7F50, red)",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
        borderRadius: "8px",
        boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h1 style={{ margin: 0 }}>Minha Aplicação</h1>
      <button
        onClick={onLogout}
        style={{
          backgroundColor: "#000000", // Cor vermelha mantida
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => e.target.style.background = "#d32f2f"} // Tom de vermelho mais escuro ao passar o mouse
        onMouseLeave={(e) => e.target.style.background = "#f44336"} // Retorna ao vermelho original
      >
        Sair
      </button>
    </header>
  );
};


const Registro = ({ callback }) => {
  const [dados, setDados] = useState({ usuario: "", senha: "", confirma: "" });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (dados.senha !== dados.confirma) {
      setMensagem("As senhas não coincidem.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/app/registrar`, {
        usuario: dados.usuario,
        senha: dados.senha,
        confirma: dados.confirma,
      });
      if (response.status === 200) {
        if (response.data.erro) {
          setMensagem(response.data.erro);
        } else {
          const { token } = response.data;
          localStorage.setItem("token", token);
          callback(response.data);
          navigate('/produto');
        }
      }
    } catch (error) {
      setMensagem("Erro ao fazer o registro.");
      console.error("Erro ao fazer o registro:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Usuário"
        value={dados.usuario}
        onChange={(e) => setDados({ ...dados, usuario: e.target.value })}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Senha"
        value={dados.senha}
        onChange={(e) => setDados({ ...dados, senha: e.target.value })}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirme a Senha"
        value={dados.confirma}
        onChange={(e) => setDados({ ...dados, confirma: e.target.value })}
        style={inputStyle}
      />
      <button type="button" onClick={handleSubmit} style={buttonStyle}>Registrar-se</button>
      {mensagem && <p style={messageStyle}>{mensagem}</p>}
    </div>
  );
};

const Criar = () => {
  let usuario = localStorage.getItem("usuario");
  const [dados, setDados] = useState({ nome: "", quantidade: "", preco: "", descricao: "", usuario: usuario, imagem: "" });
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/app/produtos`, dados, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/buscar');
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={dados.nome}
        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Quantidade"
        value={dados.quantidade}
        onChange={(e) => setDados({ ...dados, quantidade: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Preço"
        value={dados.preco}
        onChange={(e) => setDados({ ...dados, preco: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Descricao"
        value={dados.descricao}
        onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Url Imagem"
        value={dados.imagem}
        onChange={(e) => setDados({ ...dados, imagem: e.target.value })}
        style={inputStyle}
      />
      <button type="button" onClick={handleSubmit} style={buttonStyle}>Criar Produto</button>
    </div>
  );
};

const Busca = () => {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  const buscarProdutos = async () => {
    try {
      let token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/app/produtos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleAlterar = (produto) => {
    navigate('/alterar', { state: produto });
  };

  const handleDeletar = (produto) => {
    navigate('/deletar', { state: produto });
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div style={{ ...containerStyle, maxWidth: "1000px", margin: "auto" }}>
      <h2>Produtos</h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "16px", color: "#000000" }}>
          {produtos.length > 0
            ? `Total de produtos: ${produtos.length}`
            : "Nenhum produto encontrado. Que tal adicionar um novo?"}
        </p>
        <button
          onClick={() => navigate('/criar')}
          style={{
            backgroundColor: "#FF7F50", // Cor teal (verde-azulado)
            color: "black", // Texto em branco
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s ease", // Adicionando transição para hover
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#000000")} // Efeito hover: verde médio
          onMouseOut={(e) => (e.target.style.backgroundColor = "#000000")} // Retorna ao teal
        >
          Criar Produto
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {produtos.length > 0 ? (
          produtos.map(produto => (
            <div
              key={produto._id}
              style={{
                background: "#000000",
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                width: "250px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                padding: "10px",
              }}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <div style={{ padding: "10px 0" }}>
                <h3 style={{ fontSize: "18px", margin: "0 0 10px" }}>{produto.nome}</h3>
                <p style={{ margin: "5px 0", color: "#FF7F50" }}>R$ {produto.preco}</p>
                <p style={{ margin: "5px 0", color: "#FF7F50" }}>Quantidade: {produto.quantidade}</p>
                <p style={{ margin: "5px 0", color: "#FF7F50  " }}>{produto.descricao}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => handleAlterar(produto)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "none",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Alterar
                </button>
                <button
                  onClick={() => handleDeletar(produto)}
                  style={{
                    backgroundColor: "#white",
                    color: "black",
                    border: "none",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#888" }}>Nenhum produto disponível.</p>
        )}
      </div>
    </div>
  );
};

const Login = ({ callback }) => {
  const [dados, setDados] = useState({ usuario: "", senha: "" });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/registro');
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/app/login`, dados);
      if (response.status === 200) {
        if (response.data.erro) {
          setMensagem(response.data.erro);
        } else {
          const { token } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("usuario", dados.usuario);
          callback(response.data);
          navigate('/busca');
        }
      }
    } catch (error) {
      setMensagem("Errou no login, perdeu.");
      console.error("Errou no login, perdeu: ", error);
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Usuário"
        value={dados.usuario}
        onChange={(e) => setDados({ ...dados, usuario: e.target.value })}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Senha"
        value={dados.senha}
        onChange={(e) => setDados({ ...dados, senha: e.target.value })}
        style={inputStyle}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button type="button" onClick={handleRegister} style={buttonStyle}>Registrar-se</button>
        <button type="button" onClick={handleSubmit} style={{ ...buttonStyle, background: "#28A745" }}>Login</button>
      </div>
      {mensagem && <p style={messageStyle}>{mensagem}</p>}
    </div>
  );
};


const Delete = () => {
  const { state: produto } = useLocation();
  const [dados, setDados] = useState({ ...produto, id: produto._id });
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/app/produtos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: dados.id },
      });
      navigate('/buscar');
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <p>Tem certeza de que deseja deletar o produto?</p>
      <button type="button" onClick={handleDelete} style={{ ...buttonStyle, background: "red" }}>Deletar</button>
    </div>
  );
};

const Alterar = () => {
  const { state: produto } = useLocation();
  const [dados, setDados] = useState({ ...produto, id: produto._id });
  const navigate = useNavigate();

  console.log(dados);

  let token = localStorage.getItem("token");
  const handleSubmit = async () => {
    try {
      // Validação simples (caso precise)
      if (!dados.nome || !dados.preco || !dados.quantidade || !dados.descricao || !dados.imagem) {
        return;
      }

      // Fazendo o PUT request para atualizar o produto
      await axios.put(`${API_URL}/app/produtos`, dados, {
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token no header
        },
      });

      // Se a requisição for bem-sucedida, redireciona para a página de busca
      navigate('/buscar');
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={dados.nome}
        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
        style={inputStyle}
        readOnly
      />
      <input
        type="number"
        placeholder="Quantidade"
        value={dados.quantidade}
        onChange={(e) => setDados({ ...dados, quantidade: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Preço"
        value={dados.preco}
        onChange={(e) => setDados({ ...dados, preco: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Descricao"
        value={dados.descricao}
        onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Url Imagem"
        value={dados.imagem}
        onChange={(e) => setDados({ ...dados, imagem: e.target.value })}
        style={inputStyle}
      />
      <button type="button" onClick={handleSubmit} style={buttonStyle}>Atualizar Produto</button>
    </div>
  );
};


const App = () => {
  const [autenticado, setAuthentication] = useState(false);

  const EfetuaLogin = (dados) => {
    localStorage.setItem("MEU_SITE", true);
    setAuthentication(true);
    window.location = "/";
  };

  const Deslogar = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("MEU_SITE");
    localStorage.removeItem("usuario");
    setAuthentication(false);
    window.location = "/login";
  };

  useEffect(() => {
    VerificaLogin();
  }, []);

  const VerificaLogin = () => {
    const auth = localStorage.getItem("token");
    setAuthentication(!!auth);
  };

  const RotasPrivadas = () => {
    const auth = localStorage.getItem("MEU_SITE");
    return auth ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Header onLogout={Deslogar} />
      <Routes>
        <Route path="/login" element={<Login callback={EfetuaLogin} />} />
        <Route path="/registro" element={<Registro callback={Registro} />} />

        <Route element={<RotasPrivadas />}>
          <Route path="/" element={<Busca callback={Busca} />} />
          <Route path="/criar" element={<Criar callback={Criar} />} />
          <Route path="/buscar" element={<Busca callback={Busca} />} />
          <Route path="/alterar" element={<Alterar callback={Alterar} />} />
          <Route path="/deletar" element={<Delete callback={Delete} />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;