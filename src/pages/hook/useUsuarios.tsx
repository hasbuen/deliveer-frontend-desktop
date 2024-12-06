import { useState } from 'react';
import { gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Permissao } from '../../types/permissoes.interface';
import getGraphQLClient from '../../utils/graphqlClient';
import { BUSCA_PARAMETROS_USUARIO } from '../../graphql/mutations/usuario.mutation';
import { toast } from 'react-toastify';
import { errors } from '../../constants/messages/errors';

interface BuscaUsuarioResposta {
    buscaUsuario: { id: string };
}

interface BuscaParametrosResponse {
    buscaParametrosPorUsuarioId: Permissao[];
}

export const useUsuarios = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const client = getGraphQLClient();
    const navigate = useNavigate();

    const carregaParametrosUsuario = async (login: string): Promise<Permissao[] | false> => {
        setLoading(true);
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

            let usuarioId = response.buscaUsuario.id;
            const variables = { usuarioId };
            try {
                const response = await client.request<BuscaParametrosResponse>(BUSCA_PARAMETROS_USUARIO, variables);
                return response.buscaParametrosPorUsuarioId;

            } catch (err: any) {
                toast.error(err.response?.errors?.[0]?.message || errors.BUSCAR_PARAMETROS);

                return false;
            } finally {
                setLoading(false);
            }
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
    };

    return { loading, carregaParametrosUsuario };
}