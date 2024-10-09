import { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface para o usuário essencial
interface Usuario {
    id: string;
}

interface ApagaUsuarioResposta {
    apagaUsuario: { status: string }; // Alterei para refletir a resposta correta
}

const APAGA_USUARIO = gql`
  mutation apagaUsuario($id: String!) {
    apagaUsuario(id: $id) {
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

    const apagaUsuario = async (formData: { [key: string]: any }) => {
        const { id } = formData;

        setLoading(true); // Iniciar o estado de carregamento

        const variables = { id };

        try {
            const data: ApagaUsuarioResposta = await client.request(APAGA_USUARIO, variables);
            
            // Se a mutação foi bem-sucedida, pode-se recarregar a página ou fazer outra ação.
            if (data.apagaUsuario.status === 'success') {
                window.location.reload();
                return true;
            } else {
                toast.error('Erro ao apagar usuário: status inesperado.');
                return false;
            }
        } catch (err: any) {
            console.error("Erro ao apagar usuário:", err);
            toast.error(err.response?.errors?.[0]?.message || 'Erro ao apagar usuário');
            return false;
        } finally {
            setLoading(false); // Finalizar o estado de carregamento
        }
    };

    return { loading, apagaUsuario };
};