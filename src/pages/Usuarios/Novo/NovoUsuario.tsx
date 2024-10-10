// src/pages/Usuarios/NovoUsuario.tsx
import Formulario from '../Formulario';
import { useNovoUsuario } from "./hook/useNovoUsuario";

const NovoUsuario: React.FC = () => {
    const { novoUsuario } = useNovoUsuario();

    const registraUsuario = (formData: { [key: string]: any }) => {
        const status = 0; 
        const superiorId = localStorage.getItem('id')?.toString() ?? "";
        novoUsuario({ ...formData, status, superiorId });
    };

    const fields = [
       
        { label: 'Superior', name: 'isSuperior', type: 'checkbox' },
        { label: 'Filial', name: 'filial', type: 'text' },
        { label: 'Login', name: 'login', type: 'text' },
        { label: 'Nome Completo', name: 'nome', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Telefone', name: 'telefone', type: 'tel' },
        { label: 'Senha', name: 'senha', type: 'password' },
        { label: 'Confirmar senha', name: 'confirmarSenha', type: 'password' },
        { label: 'Aniversário', name: 'aniversario', type: 'date' },
        { label: 'CEP', name: 'cep', type: 'text' },
        { label: 'Logradouro', name: 'logradouro', type: 'text' },
        { label: 'Bairro', name: 'bairro', type: 'text' },
        { label: 'Localidade', name: 'Localidade', type: 'text' },
        { label: 'UF', name: 'uf', type: 'text' },
        { label: 'IBGE', name: 'ibge', type: 'text' },
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