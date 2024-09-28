import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useUsuarios } from "./hooks/useUsuarios"; // Hook de autenticação
import Navbar from './Navbar';
import SidebarMenu from './SidebarMenu';
import Formulario from './Formulario';
import { UserGroupIcon, UserPlusIcon, PencilSquareIcon, UserMinusIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Usuario {
    nome: string;
    telefone: string;
    avatar: string;
}

const Usuarios: React.FC = () => {
    const [avatar, setAvatar] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const { loading, todos } = useUsuarios();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAvatar = localStorage.getItem('avatar');
        const storedLogin = localStorage.getItem('login');
        if (!storedLogin) {
            navigate('/');
        } else {
            setAvatar(storedAvatar || ""); 
            setLogin(storedLogin);
        }

        // Chama o método getUsuarios e mapeia os dados para o estado de usuarios
        todos().then((usuarios: any[]) => {
            const mapeiaUsuarios = usuarios.map((usuario: any) => ({
                nome: usuario.nome, 
                telefone: usuario.telefone,
                avatar: usuario.avatar 
            }));
            setUsuarios(mapeiaUsuarios);
        }).catch(error => {
            console.error("Erro ao carregar os usuários", error);
        });

    }, [navigate, todos]);

    const logout = () => {
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        navigate('/');
    };

    const menuItems = [
        { name: 'Novo', href: '/usuarios/novo', icon: UserPlusIcon },
        { name: 'Editar', href: '/usuarios/editar', icon: PencilSquareIcon },
        { name: 'Apagar', href: '/usuarios/apagar', icon: UserMinusIcon },
        { name: 'Monitorar', href: '/usuarios/monitorar', icon: EyeIcon },
    ];

    const novoUsuario = (formData: { [key: string]: any }) => {
       // cria(formData);
        {loading && <p>Carregando...</p>}
        navigate('/usuarios'); 
    };

    const fields = [
        { label: 'Superior', name: 'isSuperior', type: 'checkbox' },
        { label: 'Filial', name: 'filial', type: 'select', options: [
            { value: 'filial1', label: 'Filial 1' },
            { value: 'filial2', label: 'Filial 2' },
            { value: 'filial3', label: 'Filial 3' },
        ] },
        { label: 'Login', name: 'login', type: 'text' },
        { label: 'Nome Completo', name: 'nome', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Telefone', name: 'telefone', type: 'phone' },
        { label: 'Senha', name: 'senha', type: 'password' },
        { label: 'Confirmar senha', name: 'confirmarSenha', type: 'password' },
        { label: 'Aniversário', name: 'aniversario', type: 'date' },
        { label: 'Avatar', name: 'avatar', type: 'file' }
    ];

    return (
        <div className="flex flex-col h-screen">
            <Navbar avatar={avatar} login={login} logout={logout} />
            <div className="flex flex-1">
                <SidebarMenu
                    title="Usuários"
                    icon={UserGroupIcon}
                    menuItems={menuItems}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
                <main className="flex-1 p-10">
                    <Routes>
                        <Route path="/" element={
                            <div className="bg-white py-24 sm:py-32">
                                <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                                    <div className="max-w-2xl">
                                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Lista de Usuários</h2>
                                        <p className="mt-6 text-lg leading-8 text-gray-600">
                                            Aqui estão os usuários registrados.
                                        </p>
                                    </div>
                                    <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                                        {usuarios.map((usuario) => (
                                            <li key={usuario.nome}>
                                                <div className="flex items-center gap-x-6">
                                                    <img alt="" src={`/avatars/${usuario.avatar}`}  className="h-16 w-16 rounded-full" />
                                                    <div>
                                                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{usuario.nome}</h3>
                                                        <p className="text-sm font-semibold leading-6 text-indigo-600">{usuario.telefone}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        } />
                        <Route path="novo" element={
                            <div className="max-w-2xl rounded-md shadow-sm mx-auto">
                                <Formulario name={"Novo usuário"} fields={fields} onSubmit={novoUsuario} />
                            </div>
                        } />
                        {/* Outras rotas podem ser adicionadas aqui */}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Usuarios;
