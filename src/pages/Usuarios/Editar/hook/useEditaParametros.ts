import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';

const EDITA_PARAMETROS = gql`
mutation editaParametros(
  $usuarioId: String!,
  $parametros: [ParametroInput!]!
) {
  editaParametros(
    usuarioId: $usuarioId,
    parametros: $parametros
  ) {
    id
    usuarioId
    tela
    leitura
    escrita
    exclusao
    edicao
  }
}
`;

export const useEditaParametro = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const client = getGraphQLClient();

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
            toast.success(mensagem+" e suas permissões foram atualizados com sucesso!");
            return true;
        } catch (err: any) {
            if (err.response?.errors?.[0]?.message === 'Unauthorized') {
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                toast.warning("Sessão expirada, faça o login novamente!");
                navigate('/');
            } else {
                toast.error(err.response?.errors?.[0]?.message || 'Erro ao atualizar parâmetros do usuário!');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, editaParametro };
}