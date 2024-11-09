import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { errors } from '../../../../constants/messages/errors';
import { APAGA_PARAMETROS, APAGA_USUARIO } from '../../../../graphql/mutations/usuario.mutation';

interface ApagaUsuarioResposta {
    apagaUsuario: boolean;
}
interface ApagaParametrosResposta {
    apagaParametros: boolean;
}

export const useApagaUsuario = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const client = getGraphQLClient();

    const apagaUsuario = async (id: string) => {
        setLoading(true);
        const variables = { id };

        try {
            let mensagem = '';

            const respostaUsuario: ApagaUsuarioResposta = await client.request(APAGA_USUARIO, variables);
            respostaUsuario.apagaUsuario
                ? mensagem = 'Dados do usuário foram apagados!'
                : toast.error(errors.DELECAO);

            const respostaParametros: ApagaParametrosResposta = await client.request(APAGA_PARAMETROS, { usuarioId: id });
            respostaParametros.apagaParametros
                ? toast.success(mensagem+' Parâmetros também foram apagados com sucesso!')
                : toast.error(errors.DELECAO);

            return respostaUsuario.apagaUsuario && respostaParametros.apagaParametros;
        } catch (err: any) {
            toast.error(errors.REQUISICAO);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, apagaUsuario };
};

