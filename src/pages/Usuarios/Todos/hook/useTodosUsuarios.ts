import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { errors } from '../../../../constants/messages/errors';

interface Usuario {
  login: string;
  nome: string;
  email: string;
  superiorId: string;
  senha: string;
  aniversario: Date;
  telefone: string;
  isSuperior: boolean;
  cep: String | null;
  logradouro: String | null;
  numero: String | null;
  bairro: String | null;
  localidade: String | null;
  uf: String | null;
  ibge: String | null;
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
      cep
      logradouro
      numero
      bairro
      localidade
      uf
      ibge
      avatar
      isSuperior
    }
  }
`;

export const useTodosUsuarios = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const client = getGraphQLClient();

  const todosUsuarios = async (): Promise<Usuario[]> => {
    setLoading(true);

    try {
      const id = localStorage.getItem('id');
      const todosUsuarios: TodosUsuariosResposta = await client.request(TODOS_USUARIOS, { superiorId: id });
      return todosUsuarios.todosUsuarios;
    } catch (err: any) {
      console.error(err);

      if (err.response?.errors?.[0]?.message === 'Unauthorized') {
       
        localStorage.removeItem('token');
        localStorage.removeItem('id');

        toast.warning("Sessão expirada, faça o login novamente!");
      
        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || errors.BUSCAR_USUARIOS);
      }

      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, todosUsuarios };
};
