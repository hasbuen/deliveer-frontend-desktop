import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { useNovoParametro } from './useNovoParametro';
import { errors } from '../../../../constants/messages/errors';
import { Usuario } from '../../../../types/usuario.interface';
import { NOVO_USUARIO } from '../../../../graphql/mutations/usuario.mutation';

interface NovoUsuarioResposta {
  novoUsuario: Usuario;
}

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