import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const client = new GraphQLClient('http://148.113.204.23:3000/graphql');

// Definindo o tipo para a resposta da API
interface Usuario {
  id: string;
  login: string;
  token: string;
  superior: string;
  senhaSuperior: string,
}

interface AutenticaResposta {
  autentica: Usuario;
}

interface RedefineResposta {
  redefine: Usuario;
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

export function useAutentica() {
  const [loading, setLoading] = useState<boolean>(false);

  const autentica = async (login: string, senha: string) => {
    setLoading(true);
    try {
      const variables = { login, senha };
      const data: AutenticaResposta = await client.request(AUTENTICA, variables);
      if (data) {
        toast.success(`${data.autentica.login}, bem vindo(a)!`);
        return;
      } else {
        toast.error("verifique");
      }
    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message);
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

  return { loading, autentica, redefine };
}