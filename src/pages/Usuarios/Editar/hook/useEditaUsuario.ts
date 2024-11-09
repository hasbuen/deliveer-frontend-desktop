import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { useEditaParametro } from './useEditaParametros';
import { errors } from '../../../../constants/messages/errors';
import { EDITA_USUARIO } from '../../../../graphql/mutations/usuario.mutation';
interface BuscaUsuarioResposta {
  buscaUsuario: { id: string };
}

interface FormData {
  login: string;
  nome?: string;
  email?: string;
  superiorId?: string;
  senha?: string;
  aniversario?: string;
  telefone?: string;
  isSuperior?: boolean;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  token?: string;
  avatar?: string;
  filialId?: string;
  parametros?: Array<{ usuarioId: string; tela: string; leitura: boolean; escrita: boolean; exclusao: boolean; edicao: boolean }>;
}

export const useEditaUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const client = getGraphQLClient();
  const { editaParametro } = useEditaParametro();

  const editaUsuario = async (formData: FormData) => {

    const {
      login,
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
      if (err.response?.errors?.[0]?.message === 'Unauthorized') {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        toast.warning("Sessão expirada, faça o login novamente!");
        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || 'Usuário inexistente!');
      }
      return false;
    }

    const variables = {
      id: usuarioId,
      nome: nome || null,
      email: email || null,
      superiorId: superiorId || null,
      senha: senha || null,
      aniversario: aniversario || null,
      telefone: telefone || null,
      isSuperior: isSuperior !== undefined ? isSuperior : false,
      cep: cep || null,
      logradouro: logradouro || null,
      numero: numero || null,
      bairro: bairro || null,
      localidade: localidade || null,
      uf: uf || null,
      ibge: ibge || null,
      token: token || null,
      avatar: avatar || null,
      filialId: filialId || null,
    };

    setLoading(true);

    try {
      await client.request(EDITA_USUARIO, variables);

      if (parametros) {
        await editaParametro(usuarioId, parametros, "Dados do usuário");
      } else {
        toast.success("Usuário atualizado!");
      }
      
      return true;
    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message || errors.ATUALIZAR_USUARIO);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, editaUsuario };
};