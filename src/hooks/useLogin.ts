import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configura o cliente GraphQL com a URL do servidor
const client = new GraphQLClient('http://148.113.204.23:3000/graphql');

// Interface para o usuário essencial
interface Usuario {
  id: string;         // ID do usuário
  login: string; 
  status: string;     // Login do usuário
  nome: string;       // Nome do usuário
  isSuperior: boolean; // Indica se o usuário é superior
  avatar: string;
}

// Interface para a resposta de autenticação
interface AuthResponse {
  access_token: string; // Token de acesso
  usuario: Usuario; // Detalhes do usuário autenticado
}

interface AutenticaResposta {
  login: AuthResponse;
}

interface RedefineResposta {
  redefine: AuthResponse;
}

// Consultas e mutações GraphQL
const LOGIN = gql`
  mutation login($login: String!, $senha: String!) {
    login(login: $login, senha: $senha) {
      access_token
      usuario {
        id
        login
        status
        nome
        avatar
        isSuperior
      }
    }
  }
`;


const REDEFINE = gql`
  mutation Redefine($login: String!, $senha: String!, $superior: String!, $senhaSuperior: String!) {
    redefine(login: $login, senha: $senha, superior: $superior, senhaSuperior: $senhaSuperior) {
      id
      login
      token
    }
  }
`;

// Hook personalizado para manipular autenticação e operações de usuários
export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Função de autenticação
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
        toast.error('Login ou senha incorretos');
        return false;
      }
    } catch (err: any) {
      console.error(err); 
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao autenticar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para redefinir senha
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
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao redefinir senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  


  return { loading, autentica, redefine };
}