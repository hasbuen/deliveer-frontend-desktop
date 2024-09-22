import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const client = new GraphQLClient('http://148.113.204.23:3000/graphql');

interface Usuario {
  id: string;
  login: string;
  token: string;
  superior: string;
  senhaSuperior: string;
  senha: string;
  nome: string;
}

interface AutenticaResposta {
  autentica: Usuario;
}

interface RedefineResposta {
  redefine: Usuario;
}

interface CriaUsuarioResposta {
  cria: Usuario;
}

interface GetUsuariosResposta {
  todos: Usuario[];
}

const AUTENTICA = gql`
  query Autentica($login: String!, $senha: String!) {
    autentica(login: $login, senha: $senha) {
      id
      login
      token
    }
  }
`;

const REDEFINE = gql`
  mutation Redefine($login: String!, $senha: String!, $superior: String!, $senhaSuperior: String!) {
    redefine(login: $login, senha: $senha, superior: $superior, senhaSuperior: $senhaSuperior) {
      id
      login
      senha
      superior
      senhaSuperior
      token
    }
  }
`;

const CRIA_USUARIO = gql`
  mutation CriaUsuario(
    $login: String!,
    $senha: String!,
    $nome: String!,
    $avatar: String!,
    $aniversario: String!,
    $email: String,
    $telefone: String,
    $superior: String,
    $senhaSuperior: String
  ) {
    cria(
      login: $login,
      senha: $senha,
      nome: $nome,
      avatar: $avatar,
      aniversario: $aniversario,
      email: $email,
      telefone: $telefone,
      superior: $superior,
      senhaSuperior: $senhaSuperior
    ) {
      id
      login
      nome
    }
  }
`;

const GET_USUARIOS = gql`
query GetUsuarios {
  usuarios {
    id
    nome
    telefone
    avatar
  }
}
`;

export function useAutentica() {
  const [loading, setLoading] = useState<boolean>(false);

  const autentica = async (login: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const variables = { login, senha };
      const data: AutenticaResposta = await client.request(AUTENTICA, variables);
      if (data) {
        localStorage.setItem('login', data.autentica.login);
        localStorage.setItem('token', data.autentica.token);
        toast.success(`${data.autentica.login}, bem vindo(a)!`);
        return true;
      } else {
        toast.error("verifique");
        return false;
      }
    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const redefine = async (login: string, senha: string, confirmaSenha: string, superior: string, senhaSuperior: string) => {
    setLoading(true);
    try {
      if (senha === confirmaSenha) {
        const variables = { login, senha, superior, senhaSuperior };
        const data: RedefineResposta = await client.request(REDEFINE, variables);

        localStorage.setItem('login', data.redefine.login);
        localStorage.setItem('token', data.redefine.token);
        toast.success(`Senha do usuário ${data.redefine.login} alterada com sucesso!`);
      } else {
        toast.error(`Confirme nova senha para usuário ${login}!`);
      }
    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message);
    } finally {
      setLoading(false);
    }
  };

  const criaUsuario = async (formData: { [key: string]: any }) => {
    const {
      login,
      senha,
      nomeCompleto,
      avatar,
      aniversario,
      email,
      telefone,
      superior,
      senhaSuperior,
    } = formData;

    const variables = {
      login,
      senha,
      nome: nomeCompleto,
      avatar,
      aniversario,
      email,
      telefone,
      superior,
      senhaSuperior,
    };
    setLoading(true)
    try {
      const data: CriaUsuarioResposta = await client.request(CRIA_USUARIO, variables);
      toast.success(`Usuário ${data.cria.nome} criado com sucesso!`);
      return true;
    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const getUsuarios = async (): Promise<Usuario[]> => {
    setLoading(true);
    try {
      const data: GetUsuariosResposta = await client.request(GET_USUARIOS);
      return data.todos;
    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, autentica, redefine, criaUsuario, getUsuarios };
}