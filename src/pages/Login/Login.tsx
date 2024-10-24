import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useLogin } from "../../hooks/useLogin.ts";

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [superior, setSuperior] = useState("");
  const [senhaSuperior, setSenhaSuperior] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, autentica, redefine } = useLogin();

  const acessar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sucesso = await autentica(login, senha);
    if (sucesso) {
      navigate('/dashboard');
    }
  };

  const redefinirSenha = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sucesso = await redefine(login, senha, confirmaSenha, superior);
    if (sucesso) {
      // Você pode adicionar uma mensagem de sucesso ou redirecionar para outra página
      fecharRedefinirSenha();
    } else {
      // Aqui você pode adicionar uma lógica para mostrar uma mensagem de erro
    }
  };

  const abrirRedefinirSenhaModal = () => {
    setIsModalOpen(true);
  };

  const fecharRedefinirSenha = () => {
    setIsModalOpen(false);
    // Resetar os campos do modal
    setSuperior("");
    setSenhaSuperior("");
    setConfirmaSenha("");
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="DeliVeer"
          src="/public/logomarca.png"
          className="mx-auto h-28 w-auto"
        />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={acessar} className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="usuario" className="block text-lg font-medium leading-6 text-rose-600">
                Usuário
              </label>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-rose-600 dark:text-white">Usuário</label>
              <input
                id="login"
                name="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="block w-full rounded-lg p-2.5 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="senha" className="block text-lg font-medium leading-6 text-rose-600">
                Senha
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    abrirRedefinirSenhaModal();
                  }}
                  className="font-semibold text-rose-600 hover:text-rose-800"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-rose-600 dark:text-white">Sua senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-lg p-2.5 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              Acessar
            </button>
          </div>
        </form>

        {loading && <p>Carregando...</p>}

        {/* Modal de redefinição de senha */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Redefinir Senha</h2>
              <form onSubmit={redefinirSenha} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-rose-600">Superior</label>
                  <input
                    id="superior"
                    name="superior"
                    type="text"
                    value={superior}
                    onChange={(e) => setSuperior(e.target.value)}
                    className="block w-full rounded-lg p-2.5 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-fuchsia-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rose-600">Senha do Superior</label>
                  <input
                    id="senhaSuperior"
                    name="senhaSuperior"
                    type="password"
                    value={senhaSuperior}
                    onChange={(e) => setSenhaSuperior(e.target.value)}
                    className="block w-full rounded-lg p-2.5 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rose-600">Nova Senha</label>
                  <input
                    id="novaSenha"
                    name="novaSenha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="block w-full rounded-lg p-2.5 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rose-600">Confirmar Nova Senha</label>
                  <input
                    id="confirmaSenha"
                    name="confirmaSenha"
                    type="password"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    className="block w-full rounded-lg p-2.5 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={fecharRedefinirSenha}
                    className="rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
                  >
                    Redefinir Senha
                  </button>
                </div>
              </form>

              {loading && <p>Carregando...</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;