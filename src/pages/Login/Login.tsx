import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useLogin } from "../../hooks/useLogin.ts";

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const { loading, autentica } = useLogin();

  const acessar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sucesso = await autentica(login, senha);
    if (sucesso) {
      navigate('/dashboard');
    }
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
                /*style={{ textTransform: 'uppercase' }}*/
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
      </div>
    </div>
  );
}

export default Login;