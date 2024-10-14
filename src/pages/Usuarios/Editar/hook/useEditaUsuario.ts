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
    cep: String,
    logradouro: String,
    numero: String,
    bairro: String,
    localidade: String,
    uf: String,
    ibge: String,
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
      cep: $cep,
      logradouro: $logradouro,
      numero: $numero,
      bairro: $bairro,
      localidade: $localidade,
      uf: $uf,
      ibge: $ibge,
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
      cep
      logradouro
      numero
      bairro
      localidade
      uf
      ibge
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
      parametroId,
      filialId } = formData;

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
      if (err.response?.errors?.[0]?.message === 'Unauthorized') {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        toast.warning("Sessão expirada, faça o login novamente!");
        navigate('/');
      } else {
        toast.error(err.response?.errors?.[0]?.message || 'Erro ao editar usuários');
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