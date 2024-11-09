import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { errors } from '../../../../constants/messages/errors';
import { Permissao } from '../../../../types/permissoes.interface';
import { BUSCA_PARAMETROS_USUARIO, EDITA_PARAMETROS } from '../../../../graphql/mutations/usuario.mutation';

interface BuscaParametrosResponse {
  buscaParametrosPorUsuarioId: Permissao[];
}

export const useEditaParametro = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const client = getGraphQLClient();

  const carregaParametrosUsuario = async (usuarioId: string): Promise<Permissao[] | false> => {
    setLoading(true);
    const variables = { usuarioId };
    
    try {
      const response = await client.request<BuscaParametrosResponse>(BUSCA_PARAMETROS_USUARIO, variables);
      console.log(JSON.stringify(response))
      return response.buscaParametrosPorUsuarioId;

    } catch (err: any) {
      toast.error(err.response?.errors?.[0]?.message || errors.BUSCAR_PARAMETROS);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

    const editaParametro = async (
      usuarioId: string,
      parametros: Array<{
        usuarioId: string;
        tela: string;
        leitura: boolean;
        escrita: boolean;
        exclusao: boolean;
        edicao: boolean
      }>,
      mensagem: string
    ) => {
      const variables = {
        usuarioId,
        parametros,
      };

      setLoading(true);

      try {
        await client.request(EDITA_PARAMETROS, variables);
        toast.success(mensagem + " e suas permissões foram atualizados com sucesso!");
        return true;
      } catch (err: any) {
        if (err.response?.errors?.[0]?.message === 'Unauthorized') {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          toast.warning("Sessão expirada, faça o login novamente!");
          navigate('/');
        } else {
          toast.error(err.response?.errors?.[0]?.message || errors.ATUALIZAR_PARAMETROS);
        }
        return false;
      } finally {
        setLoading(false);
      }
    };

    return { loading, carregaParametrosUsuario, editaParametro };
  }