import { useState } from 'react';
import { gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getGraphQLClient from '../../../../utils/graphqlClient';

interface ApagaUsuarioResposta {
    apagaUsuario: boolean;
}
interface ApagaParametrosResposta {
    apagaParametros: boolean;
}

const APAGA_USUARIO = gql`
          mutation apagaUsuario($id: String!) {
            apagaUsuario(id: $id)
          }
        `;

const APAGA_PARAMETROS = gql`
          mutation apagaParametros($usuarioId: String!) {
            apagaParametros(usuarioId: $usuarioId)
          }
        `;

export const useApagaUsuario = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const client = getGraphQLClient();

    const apagaUsuario = async (id: string) => {
        setLoading(true);
        const variables = { id };

        try {
            const respostaUsuario: ApagaUsuarioResposta = await client.request(APAGA_USUARIO, variables);
            respostaUsuario.apagaUsuario
                ? toast.success('Dados do usuário foram apagados com sucesso!')
                : toast.error('Erro ao apagar os dados do usuário.');

            const respostaParametros: ApagaParametrosResposta = await client.request(APAGA_PARAMETROS, { usuarioId: id });
            respostaParametros.apagaParametros
                ? toast.success('Parâmetros do usuário foram apagados com sucesso!')
                : toast.error('Erro ao apagar os dados do usuário.');

            const sucesso = respostaUsuario.apagaUsuario && respostaParametros.apagaParametros;
            if (sucesso) window.location.reload();
            return sucesso;

        } catch (err: any) {
            toast.error('Erro ao processar a requisição.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, apagaUsuario };
};

