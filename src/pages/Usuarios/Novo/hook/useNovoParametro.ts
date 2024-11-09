import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import getGraphQLClient from '../../../../utils/graphqlClient';
import { errors } from '../../../../constants/messages/errors';
import { NOVO_PARAMETRO } from '../../../../graphql/mutations/usuario.mutation';

export const useNovoParametro = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const client = getGraphQLClient();

    const novoParametro = async (usuarioId: string, formData: { [key: string]: any }) => {
        const { tela, leitura, escrita, exclusao, edicao } = formData;
        
        const variables = {
            usuarioId,
            tela,
            leitura: leitura !== undefined ? leitura : false,
            escrita: escrita !== undefined ? escrita : false,
            exclusao: exclusao !== undefined ? exclusao : false,
            edicao: edicao !== undefined ? edicao : false,
        };

        setLoading(true);

        try {
            await client.request(NOVO_PARAMETRO, variables);
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

    return { loading, novoParametro };
}