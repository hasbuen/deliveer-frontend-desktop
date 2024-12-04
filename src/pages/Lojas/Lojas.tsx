import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import SidebarMenu from '../../components/SidebarMenu/SidebarMenu';
import { BuildingStorefrontIcon, NewspaperIcon, UserPlusIcon, PencilSquareIcon, UserMinusIcon, EyeIcon } from '@heroicons/react/24/outline';
import TodasLojas from './Todas/TodasLojas'; 
import NovaLoja from './Nova/NovaLoja';
import EditaLoja from './Editar/EditarLoja';
import ApagaLoja from './Apagar/ApagarLoja';
import MonitorarLoja from './Monitorar/MonitorarLoja';

const Lojas: React.FC = () => {
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
        { name: 'Todas', href: '/lojas', icon: NewspaperIcon },
        { name: 'Nova', href: '/lojas/nova', icon: UserPlusIcon },
        { name: 'Editar', href: '/lojas/editar', icon: PencilSquareIcon },
        { name: 'Apagar', href: '/lojas/apagar', icon: UserMinusIcon },
        { name: 'Monitorar', href: '/lojas/monitorar', icon: EyeIcon },
    ];

    return (
        <div className="flex flex-col h-screen">
            <Navbar avatar={avatar} login={login} logout={logout} />
            <div className="flex flex-1">
                <SidebarMenu
                    title="Lojas"
                    icon={BuildingStorefrontIcon}
                    menuItems={menuItems}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
                <main className="flex-1 p-10">
                    <Routes>
                        <Route path="/" element={<TodasLojas />} />
                        <Route path="nova" element={<NovaLoja />} />
                        <Route path="editar" element={<EditaLoja />} />
                        <Route path="apagar" element={<ApagaLoja />} />
                        <Route path="monitorar" element={<MonitorarLoja />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Lojas;
