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

interface BuscaUsuarioResposta {
  buscaUsuario: { id: string };
}

interface EditaUsuarioResposta {
  editaUsuario: Usuario;
}

const EDITA_USUARIO = gql`
  mutation editaUsuario(
    $id: String!,
    $nome: String,
    $email: String,
    $superiorId: String,
    $senha: String,
    $aniversario: String,
    $telefone: String,
    $isSuperior: Boolean,
    $token: String,
    $avatar: String,
    $parametroId: String,
    $filialId: String
  ) {
    editaUsuario(
      id: $id,
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
      nome
      email
      superiorId
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

export const useUsuarios = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token');
  const client = new GraphQLClient('http://148.113.204.23:3000/graphql', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const editaUsuario = async (formData: { [key: string]: any }) => {
    const { login, nome, email, superiorId, senha, aniversario, telefone, isSuperior, token, avatar, parametroId, filialId } = formData;

    // 1. Primeiro, busque o ID do usuário pelo login
    let usuarioId: string;

    try {
      const response: BuscaUsuarioResposta = await client.request(
        gql`
          query buscaUsuario($login: String!) {
            buscaUsuario(login: $login) {
              id
            }
          }
        `,
        { login }
      );
      usuarioId = response.buscaUsuario.id;
    } catch (err: any) {
      console.error("Erro ao buscar usuário:", err);
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao buscar usuário');
      return false;
    }

    // 2. Agora, faça a atualização dos dados do usuário
    const variables = {
      id: usuarioId,
      nome: nome || null,
      email: email || null,
      superiorId: superiorId || null,
      senha: senha || null,
      aniversario: aniversario || null,
      telefone: telefone || null,
      isSuperior: isSuperior !== undefined ? isSuperior : false,
      token: token || null,
      avatar: avatar || null,
      parametroId: parametroId || null,
      filialId: filialId || null,
    };

    setLoading(true);

    try {
      const data: EditaUsuarioResposta = await client.request(EDITA_USUARIO, variables);
      window.location.reload();
      return true;
    } catch (err: any) {
      console.error("Erro ao editar usuário:", err);
      toast.error(err.response?.errors?.[0]?.message || 'Erro ao editar usuário');
      return false;
    } finally {
      setLoading(false);
    }
  };


  return { loading, editaUsuario };
};