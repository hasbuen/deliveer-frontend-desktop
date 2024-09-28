import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface para o usuário essencial
interface Usuario {
  id: string;
  login: string;
  nome: string;
  isSuperior: boolean;
}

interface GetUsuariosResposta {
  todos: Usuario[];
}

// Query GraphQL para obter os usuários
const GET_USUARIOS = gql`
  query getUsuarios {
    getUsuarios {
      id
      telefone
      nome
      avatar
    }
  }
`;

// Hook personalizado para manipular autenticação e operações de usuários
export const useUsuarios = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Função para buscar todos os usuários
  const todos = async (): Promise<Usuario[]> => {
    setLoading(true);

    // Recupera o token do localStorage
    const token = localStorage.getItem('token');

    // Configura o cliente GraphQL com o token no cabeçalho
    const client = new GraphQLClient('http://148.113.204.23:3000/graphql', {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
      },
    });

    try {
      const data: GetUsuariosResposta = await client.request(GET_USUARIOS);
      return data.todos;
    } catch (err: any) {
      console.error(err); // Log para depuração
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao buscar usuários');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, todos };
};