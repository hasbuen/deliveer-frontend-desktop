import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ApagaUsuarioResposta {
    status: { status: string }; 
}

const APAGA_USUARIO = gql`
  mutation apagaUsuario($id: String!) {
    apagaUsuario(id: $id) {
      status
    }
  }
`;

const APAGA_PARAMETROS = gql`
  mutation apagaParametros($id: String!) {
    apagaParametros(id: $id) {
      status
    }
  }
`;

export const useApagaUsuario = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem('token');
    const client = new GraphQLClient('http://148.113.204.23:3000/graphql', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const apagaUsuario = async (id: string) => {
        setLoading(true); 

        const variables = { id };

        try {
            const resposta: ApagaUsuarioResposta = await client.request(APAGA_USUARIO, variables);
            console.log(resposta+" AQUI......: "+JSON.stringify(variables))
            
            await client.request(APAGA_PARAMETROS, variables);

            toast.success('Dados do usuário foram apagados com sucesso!');
            if (resposta.status) {
                window.location.reload();
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
            setLoading(false); 
        }
    };

    return { loading, apagaUsuario };
};