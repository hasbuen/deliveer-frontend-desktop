import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import getGraphQLClient from '../../../../utils/graphqlClient';
import { isAuthenticated } from '../../../../utils/auth';

// Interface para o usuário essencial
interface Usuario {
  login: string;
  nome: string;
  email: string;
  superiorId: string;
  senha: string;
  aniversario: Date;
  telefone: string;
  isSuperior: boolean;
  token: string | null;
  avatar: string | null;
  parametroId: string | null;
  filialId: string | null; 
}

interface TodosUsuariosResposta {
  todosUsuarios: Usuario[];
}

const TODOS_USUARIOS = gql`
  mutation todosUsuarios($superiorId: String!) {
    todosUsuarios(superiorId: $superiorId) {
      id
      login
      nome
      email
      telefone
      avatar
      isSuperior
    }
  }
`;

export const useTodosUsuarios = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Criar uma instância do useNavigate

  const client = getGraphQLClient();

  const todosUsuarios = async (): Promise<Usuario[]> => {

    // Verifique se o usuário está autenticado
    if (!isAuthenticated())

    setLoading(true);

    try {
      const id = localStorage.getItem('id');
      const data: TodosUsuariosResposta = await client.request(TODOS_USUARIOS, { superiorId: id });
      return data.todosUsuarios;
    } catch (err: any) {
      console.error(err);

      // Verificar se a resposta contém "Unauthorized"
      if (err.response?.errors?.[0]?.message === 'Unauthorized') {
        // Limpar o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        
        // Redirecionar para a tela de login
        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || 'Erro ao buscar usuários');
      }

      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, todosUsuarios };
};
