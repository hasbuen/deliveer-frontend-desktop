import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';

// Interface para o usuário essencial
interface Usuario {
  login: String;
  status: number;
  nome: String;
  email: String;
  superiorId: String;
  senha: String;
  aniversario: Date;
  telefone: String;
  isSuperior: boolean;
  token: string | null;
  avatar: string | null;
  parametroId: string | null;
  filialId: string | null;
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
  const navigate = useNavigate();

  // Verifique se o usuário está autenticado
  const client = getGraphQLClient();

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

      // Verificar se a resposta contém "Unauthorized"
      if (err.response?.errors?.[0]?.message === 'Unauthorized') {
        // Limpar o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        toast.warning("Sessão expirada, faça o login novamente!");
        // Redirecionar para a tela de login
        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || 'Erro ao salvar usuários');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };


  return { loading, novoUsuario };
};