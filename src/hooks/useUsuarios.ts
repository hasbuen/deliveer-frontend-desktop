import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface para o usuário essencial
interface Usuario {
  id: string;
  login: String;
  nome: String;
  email: String;
  superiorId: String;
  senha: String;
  telefone: String;
  isSuperior: boolean;
  token: String;
  avatar: String;
  aniversario: Date;
  parametroId: String;
  filialId: String
}

interface TodosUsuariosResposta {
  todosUsuarios: Usuario[];
}

interface CriateUsuarioResposta {
  criateUsuario: Usuario;
}

const TODOS_USUARIOS = gql`
  mutation todosUsuarios($superiorId: String!) {
    todosUsuarios(superiorId: $superiorId) {
      id
      nome
      telefone
      avatar
    }
  }
`;

// Mutation GraphQL para criar um novo usuário
const CRIA_USUARIO = gql`
  mutation createUsuario(
    $login: String!,
    $nome: String!,
    $email: String!,
    $superiorId: String!,
    $senha: String!,
    $telefone: String,
    $isSuperior: Boolean,
    $token: String,
    $avatar: String,
    $aniversario: Date,
    $parametroId: String,
    $filialId: String,
  ) {
  createUsuario(
    login: $login,
    nome: $nome,
    email: $email,
    superiorId: $superiorId,
    senha: $senha,
    telefone: $telefone,
    isSuperior: $isSuperior,
    token: $token,
    avatar: $avatar,
    aniversario: $aniversario,
    parametroId: $parametroId,
    filialId: $filialId,
    ) {
        id
        nome
        avatar
      }
  }
`;

// Hook personalizado para manipular autenticação e operações de usuários
export const useUsuarios = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token');
  const client = new GraphQLClient('http://148.113.204.23:3000/graphql', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });  

  // Função para buscar todos os usuários
  const todosUsuarios = async (): Promise<Usuario[]> => {
    setLoading(true);

    try {
      const id = localStorage.getItem('id');
      const data: TodosUsuariosResposta = await client.request(TODOS_USUARIOS, { superiorId: id });

      return data.todosUsuarios;
    } catch (err: any) {
      console.error(err); // Log para depuração
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao buscar usuários');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para criar novo usuário
  const criaUsuario = async (formData: {
    login: string,
    nome: string,
    email: string,
    superiorId: string,
    senha: string,
    telefone: string,
    isSuperior: boolean,
    token: string,
    avatar: string,
    aniversario: Date,
    parametroId: string,
    filialId: string,
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const data: CriateUsuarioResposta = await client.request(CRIA_USUARIO, formData);
      toast.success(`Usuário ${data.criateUsuario.login} criado com sucesso!`);
      return true;
    } catch (err: any) {
      console.error(err); // Adiciona log para depuração
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao criar usuário');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, todosUsuarios, criaUsuario };
};