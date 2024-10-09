// src/pages/Usuarios/ApagaUsuario.tsx
import { useApagaUsuario } from "./hook/useApagaUsuario";



const ApagaUsuario: React.FC = () => {
    const { apagaUsuario } = useApagaUsuario();

    const handleDelete = () => {
    };

    return (
        <div>
            <h2>Você tem certeza que deseja apagar este usuário?</h2>

        </div>
    );
};

export default ApagaUsuario;