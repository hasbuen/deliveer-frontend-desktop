import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';

interface BuscaUsuarioResposta {
  buscaUsuario: { id: string };
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

export const useEditaUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const client = getGraphQLClient();

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

      // Verificar se a resposta contém "Unauthorized"
      if (err.response?.errors?.[0]?.message === 'Unauthorized') {
        // Limpar o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        toast.warning("Sessão expirada, faça o login novamente!");
        // Redirecionar para a tela de login
        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || 'Erro ao editar usuários');
      }
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
      await client.request(EDITA_USUARIO, variables);
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