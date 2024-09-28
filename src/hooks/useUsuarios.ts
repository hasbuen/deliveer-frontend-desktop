import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface para o usuário essencial
interface Usuario {
  id: string;
  login: string;
  nome: string;
  telefone: string;
  isSuperior: boolean;
}

interface TodosUsuariosResposta {
  todosUsuarios: Usuario[];
}

// Query GraphQL para obter os usuários
const TODOS_USUARIOS = gql`
  query todosUsuarios {
    todosUsuarios {
      id
      login
      nome
      telefone
      avatar
    }
  }
`;

// Hook personalizado para manipular autenticação e operações de usuários
export const useUsuarios = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Função para buscar todos os usuários
  const todosUsuarios = async (): Promise<Usuario[]> => {
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
      const data: TodosUsuariosResposta = await client.request(TODOS_USUARIOS);
   
      return data.todosUsuarios;
    } catch (err: any) {
      console.error(err); // Log para depuração
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao buscar usuários');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, todosUsuarios };
};