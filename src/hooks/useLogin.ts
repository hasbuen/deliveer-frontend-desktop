import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from '../types/login.interface';
import { LOGIN } from '../graphql/mutations/login.mutation';
import { errors } from '../constants/messages/errors';
import getGraphQLClient from '../utils/graphqlClient';

interface AuthResponse {
  access_token: string; 
  usuario: Login; 
}

interface AutenticaResposta {
  login: AuthResponse;
}

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const autentica = async (login: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const client = getGraphQLClient();
      const data: AutenticaResposta = await client.request(LOGIN, { login, senha });

      if (data.login) {
        localStorage.setItem('id', data.login.usuario.id);
        localStorage.setItem('login', data.login.usuario.login);
        localStorage.setItem('status', data.login.usuario.status);
        localStorage.setItem('avatar', data.login.usuario.avatar);
        localStorage.setItem('token', data.login.access_token);
        toast.success(`Bem-vindo(a), ${data.login.usuario.login}!`);
        return true;
      } else {
        toast.error(errors.INVALIDAR_LOGIN);
        return false;
      }
    } catch (err: any) {
      console.error(err); 
      toast.error(err.response?.errors?.[0]?.message || errors.AUTENTICAR_LOGIN);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, autentica };
}