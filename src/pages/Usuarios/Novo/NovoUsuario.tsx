// src/pages/Usuarios/NovoUsuario.tsx
import Formulario from '../../../commons/Formulario/Formulario';
import { useNovoUsuario } from "./hook/useNovoUsuario";

const NovoUsuario: React.FC = () => {
    const { novoUsuario } = useNovoUsuario();

    const registraUsuario = (formData: { [key: string]: any }) => {
        novoUsuario(formData);
    };

    const fields = [
        { label: 'Login', name: 'login', type: 'text' },
        { label: 'Nome Completo', name: 'nome', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Telefone', name: 'telefone', type: 'tel' },
        { label: 'Senha', name: 'senha', type: 'password' },
        { label: 'Confirmar senha', name: 'confirmarSenha', type: 'password' },
        { label: 'Aniversário', name: 'aniversario', type: 'date' },
        { label: 'Avatar', name: 'avatar', type: 'file' }
    ];

    return (
        <div className="max-w-2xl rounded-md shadow-sm mx-auto">
            <Formulario
                name={"Novo usuário"}
                fields={fields}
                onSubmit={registraUsuario}
            />
        </div>
    );
};

export default NovoUsuario;