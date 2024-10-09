import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface para o usuário essencial
interface Usuario {
  login: String;
  nome: String;
  email: String;
  superiorId: String;
  senha: String;
  aniversario: Date;
  telefone: String;
  isSuperior: boolean;
  token: string | null; // Permite null
  avatar: string | null; // Permite null
  parametroId: string | null; // Permite null
  filialId: string | null; // Permite null
}

interface NovoUsuarioResposta {
  novoUsuario: Usuario;
}

const NOVO_USUARIO = gql`
mutation novoUsuario(
  $login: String!,
  $status: Int!,
  $nome: String!,
  $email: String!,
  $superiorId: String!,
  $senha: String!,
  $aniversario: String!,
  $telefone: String!,
  $isSuperior: Boolean!,
  $token: String,
  $avatar: String,
  $parametroId: String,
  $filialId: String
) {
  novoUsuario(
    login: $login,
    status: $status,
    nome: $nome,
    email: $email,
    superiorId: $superiorId,
    senha: $senha,
    aniversario: $aniversario,
    telefone: $telefone,
    isSuperior: $isSuperior,
    token: $token,
    avatar: $avatar,
    parametroId: $parametroId,
    filialId: $filialId
  ) {
        login
        status
        nome
        email
        superiorId
        senha
        aniversario
        telefone
        isSuperior
        token
        avatar
        parametroId
        filialId
  }
}
`;

export const useNovoUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token');
  const client = new GraphQLClient('http://148.113.204.23:3000/graphql', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const novoUsuario = async (formData: { [key: string]: any }) => {
    const { 
      login, 
      status, 
      nome, 
      email, 
      superiorId, 
      senha, 
      aniversario, 
      telefone, 
      isSuperior, 
      token, 
      avatar, 
      parametroId, 
      filialId } = formData;

    const variables = {
      login,
      status,
      nome,
      email,
      superiorId,
      senha,
      aniversario,
      telefone,
      isSuperior,
      token,
      avatar,
      parametroId,
      filialId
    };

    setLoading(true)

    try {
      const data: NovoUsuarioResposta = await client.request(NOVO_USUARIO, variables);
      toast.success(`Usuário ${data.novoUsuario.login} criado com sucesso!`);
      return true;
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err);

      toast.error(err.response?.errors?.[0]?.message || 'Erro ao criar usuário');
      return false;
    } finally {
      setLoading(false);
    }
  };


  return { loading, novoUsuario };
};