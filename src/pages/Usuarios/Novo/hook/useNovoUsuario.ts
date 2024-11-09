// src/pages/Usuarios/hook/useNovoUsuario.tsx
import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { useNovoParametro } from './useNovoParametro';
import { errors } from '../../../../constants/messages/errors';

interface Usuario {
  id: string;
  login: string;
  status: number;
  nome: string;
  email: string;
  superiorId: string;
  senha: string;
  aniversario: Date;
  telefone: string;
  isSuperior: boolean;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  localidade: string | null;
  uf: string | null;
  ibge: string | null;
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
    $cep: String,
    $logradouro: String,
    $numero: String,
    $bairro: String,
    $localidade: String,
    $uf: String,
    $ibge: String,
    $token: String,
    $avatar: String,
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
      cep: $cep,
      logradouro: $logradouro,
      numero: $numero,
      bairro: $bairro,
      localidade: $localidade,
      uf: $uf,
      ibge: $ibge,
      token: $token,
      avatar: $avatar,
      filialId: $filialId
    ) {
      id
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
      filialId
    }
  }
`;

export const useNovoUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const client = getGraphQLClient();
  const { novoParametro } = useNovoParametro();

  const novoUsuario = async (formData: { [key: string]: any }): Promise<boolean> => {
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
      cep,
      logradouro,
      numero,
      bairro,
      localidade,
      uf,
      ibge,
      token,
      avatar,
      filialId,
      parametros
    } = formData;

    const variables = {
      login,
      status,
      nome,
      email,
      superiorId,
      senha,
      aniversario,
      telefone,
      isSuperior: isSuperior !== undefined ? isSuperior : false,
      cep,
      logradouro,
      numero,
      bairro,
      localidade,
      uf,
      ibge,
      token,
      avatar,
      filialId
    };

    setLoading(true);

    try {
      const usuarioArmazenado: NovoUsuarioResposta = await client.request(NOVO_USUARIO, variables);
      if (usuarioArmazenado.novoUsuario.id) {

        const permissoes = Array.isArray(parametros) ? parametros : [];
        let todasPermissoesSalvas = true;
        for (const permissao of permissoes) {
          const resultado = await novoParametro(usuarioArmazenado.novoUsuario.id, permissao);
          if (!resultado) {
            todasPermissoesSalvas = false;
            break;
          }
        }

        todasPermissoesSalvas
          ? toast.success(`Usuário ${usuarioArmazenado.novoUsuario.login} cadastrado com sucesso!`)
          : toast.error(errors.SALVAR_USUARIO);
          navigate('/usuarios');
      }
      return true;
    } catch (err: any) {

      if (err.response?.errors?.[0]?.message === 'Unauthorized') {

        localStorage.removeItem('token');
        localStorage.removeItem('id');
        toast.warning("Sessão expirada, faça o login novamente!");

        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || errors.SALVAR_USUARIO);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, novoUsuario };
};