import { useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from '../types/login.interface';
import { LOGIN, REDEFINE } from '../graphql/mutations/login.mutation';
import { errors } from '../constants/messages/errors';

const client = new GraphQLClient('http://148.113.204.23:3000/graphql');

interface AuthResponse {
  access_token: string; 
  usuario: Login; 
}

interface AutenticaResposta {
  login: AuthResponse;
}

interface RedefineResposta {
  redefine: AuthResponse;
}


export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const autentica = async (login: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
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

  const redefine = async (login: string, senha: string, superior: string, senhaSuperior: string): Promise<boolean> => {
    setLoading(true);
    try {
      const variables = { login, senha, superior, senhaSuperior };
      const data: RedefineResposta = await client.request(REDEFINE, variables);

      localStorage.setItem('login', data.redefine.usuario.login);
      localStorage.setItem('token', data.redefine.access_token);
      toast.success(`Senha de ${data.redefine.usuario.nome} redefinida com sucesso!`);
      return true;
    } catch (err: any) {
      console.error(err); // Adiciona log para depuração
      toast.error(err.response?.errors?.[0]?.message || errors.REDEFINIR_SENHA);
      return false;
    } finally {
      setLoading(false);
    }
  };

  


  return { loading, autentica, redefine };
}