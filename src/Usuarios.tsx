import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import SidebarMenu from './SidebarMenu';
import Formulario from './Formulario';
import { UserGroupIcon, UserPlusIcon, PencilSquareIcon, UserMinusIcon, EyeIcon } from '@heroicons/react/24/outline';

interface User {
    name: string;
    role: string;
    imageUrl: string;
}

const Usuarios: React.FC = () => {
    const [login, setLogin] = useState<string>("");
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedLogin = localStorage.getItem('login');
        if (!storedLogin) {
            navigate('/');
        } else {
            setLogin(storedLogin);
        }

        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        };

        fetchUsers();
    }, [navigate]);

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

    const handleSubmitForm = (formData: { [key: string]: any }) => {
        console.log('Dados enviados:', formData);
        navigate('/usuarios'); // Redirecionar para a página de usuários após o envio
    };

    const fields = [
        { label: 'Filial', name: 'filial', type: 'text' },
        { label: 'Login', name: 'login', type: 'text' },
        { label: 'Nome Completo', name: 'nomeCompleto', type: 'text' },
        { label: 'Senha', name: 'senha', type: 'password' },
        { label: 'Aniversário', name: 'aniversario', type: 'date' },
        { label: 'Avatar', name: 'avatar', type: 'file' },
        { label: 'Superior', name: 'isSuperior', type: 'checkbox' },
    ];

    return (
        <div className="flex flex-col h-screen">
            <Navbar login={login} logout={logout} />
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
                                        {users.map((user) => (
                                            <li key={user.name}>
                                                <div className="flex items-center gap-x-6">
                                                    <img alt="" src={user.imageUrl} className="h-16 w-16 rounded-full" />
                                                    <div>
                                                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{user.name}</h3>
                                                        <p className="text-sm font-semibold leading-6 text-indigo-600">{user.role}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        } />
                        <Route path="novo" element={
                            <div className="max-w-4xl mx-auto">
                                <Formulario fields={fields} onSubmit={handleSubmitForm} />
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