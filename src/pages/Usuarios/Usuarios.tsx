// src/pages/Usuarios/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import SidebarMenu from '../../components/SidebarMenu/SidebarMenu';
import { UserGroupIcon, NewspaperIcon, UserPlusIcon, PencilSquareIcon, UserMinusIcon, EyeIcon } from '@heroicons/react/24/outline';
import TodosUsuarios from './Todos/TodosUsuarios'; 
import NovoUsuario from './Novo/NovoUsuario'; // Importando NovoUsuario
import EditaUsuario from './Editar/EditaUsuario'; // Importando EditaUsuario
import ApagaUsuario from './Apagar/ApagaUsuario'; // Importando ApagaUsuario
import MonitorarUsuario from './Monitorar/MonitorarUsuario'; // Importando MonitorarUsuario

const Usuarios: React.FC = () => {
    const [avatar, setAvatar] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAvatar = localStorage.getItem('avatar');
        const storedLogin = localStorage.getItem('login');
        const token = localStorage.getItem('token');

        if (!storedLogin || !token) {
            navigate('/'); 
        } else {
            setAvatar(storedAvatar || "");
            setLogin(storedLogin);
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        navigate('/');
    };

    const menuItems = [
        { name: 'Todos', href: '/usuarios', icon: NewspaperIcon },
        { name: 'Novo', href: '/usuarios/novo', icon: UserPlusIcon },
        { name: 'Editar', href: '/usuarios/editar', icon: PencilSquareIcon },
        { name: 'Apagar', href: '/usuarios/apagar', icon: UserMinusIcon },
        { name: 'Monitorar', href: '/usuarios/monitorar', icon: EyeIcon },
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
                        <Route path="/" element={<TodosUsuarios />} />
                        <Route path="novo" element={<NovoUsuario />} />
                        <Route path="editar" element={<EditaUsuario />} />
                        <Route path="apagar" element={<ApagaUsuario />} />
                        <Route path="monitorar" element={<MonitorarUsuario />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Usuarios;
