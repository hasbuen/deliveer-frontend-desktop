// src/pages/Usuarios/ApagaUsuario.tsx
import { useApagaUsuario } from "./hook/useApagaUsuario";

interface ApagaUsuarioProps {
    usuario: any;
}

const ApagaUsuario: React.FC<ApagaUsuarioProps> = ({ usuario }) => {
    const { apagaUsuario } = useApagaUsuario();

    const handleDelete = () => {
        // Passando o id como um objeto conforme esperado pela função apagaUsuario
        apagaUsuario({ id: usuario.id }) // Acessa o id do usuário
            .then(() => {
                // Você pode adicionar lógica aqui após o usuário ser apagado, como uma notificação
            })
            .catch((error) => {
                console.error("Erro ao apagar o usuário:", error);
                // Você pode adicionar uma mensagem de erro aqui, se necessário
            });
    };

    return (
        <div>
            <h2>Você tem certeza que deseja apagar este usuário?</h2>
            <p>{usuario.nome}</p> {/* Exibe o nome do usuário para confirmação */}
            <button onClick={handleDelete}>Sim, apagar</button>
        </div>
    );
};

export default ApagaUsuario;