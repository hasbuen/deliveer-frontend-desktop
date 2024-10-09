// src/pages/Usuarios/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useUsuarios } from "./hook/useUsuarios";
import Navbar from '../../components/Navbar/Navbar';
import SidebarMenu from '../../components/SidebarMenu/SidebarMenu';
import { UserGroupIcon, UserPlusIcon, PencilSquareIcon, UserMinusIcon, EyeIcon } from '@heroicons/react/24/outline';
import NovoUsuario from './Novo/NovoUsuario'; // Importando NovoUsuario
import EditaUsuario from './Editar/EditaUsuario'; // Importando EditaUsuario
import ApagaUsuario from './Apagar/ApagaUsuario'; // Importando ApagaUsuario
import MonitorarUsuario from './Monitorar/MonitorarUsuario'; // Importando MonitorarUsuario

interface Usuario {
    login: string;
    nome: string;
    email: string;
    telefone: string;
    avatar: string;
    isSuperior: string;
}

const Usuarios: React.FC = () => {
    const [avatar, setAvatar] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const { loading, todosUsuarios, novoUsuario, editaUsuario } = useUsuarios();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
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

        // Carregando todos os usuários
        todosUsuarios().then((usuarios: any[]) => {
            if (usuarios.length === 0) {
                setErrorMessage("Por que não começar a cadastrar novos usuários agora mesmo?");
            } else {
                const mapeiaUsuarios = usuarios.map((usuario: any) => ({
                    login: usuario.login,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    avatar: usuario.avatar,
                    isSuperior: usuario.isSuperior
                }));
                setUsuarios(mapeiaUsuarios);
                setErrorMessage(null);
            }
        }).catch(error => {
            console.error("Erro ao carregar os usuários", error);
            setErrorMessage("Erro ao carregar os usuários.");
        });

    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        navigate('/');
    };

    const abrirAtualizaModal = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };

    const fecharAtualizaModal = () => {
        setIsModalOpen(false);
        setUsuarioSelecionado(null);
    };

    const menuItems = [
        { name: 'Novo', href: '/usuarios/novo', icon: UserPlusIcon },
        { name: 'Editar', href: '/usuarios/editar', icon: PencilSquareIcon },
        { name: 'Apagar', href: '/usuarios/apagar', icon: UserMinusIcon },
        { name: 'Monitorar', href: '/usuarios/monitorar', icon: EyeIcon },
    ];

    const registraUsuario = (formData: { [key: string]: any }) => {
        novoUsuario(formData);
    };

    const atualizaUsuario = (formData: { [key: string]: any }) => {
        editaUsuario(formData)
            .then(() => {
                fecharAtualizaModal(); // Fecha o modal após a atualização
            });
    };

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
                                    {loading ? (
                                        <p className="text-lg leading-8 text-gray-600">Carregando...</p>
                                    ) : errorMessage ? (
                                        <p className="text-lg leading-8 text-gray-400">{errorMessage}</p>
                                    ) : (
                                        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                                            {usuarios.map((usuario) => (
                                                <li key={usuario.login}>
                                                    <div className="flex items-center gap-x-6">
                                                        <img alt="" src={`/avatars/${usuario.avatar}`} className="h-16 w-16 rounded-full" />
                                                        <div>
                                                            <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{usuario.nome}</h3>
                                                            <p className="text-sm font-semibold leading-6 text-indigo-600">{usuario.telefone}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        } />
                        <Route path="novo" element={<NovoUsuario />} />
                        <Route
                            path="editar"
                            element={<EditaUsuario usuarios={usuarios} usuarioSelecionado={usuarioSelecionado} onUpdate={atualizaUsuario} />}
                        />

                        <Route path="apagar" element={<ApagaUsuario usuario={usuarios} />} />
                        <Route path="monitorar" element={<MonitorarUsuario usuario={usuarios} />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Usuarios;