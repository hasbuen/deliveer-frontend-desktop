import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useUsuarios } from "./hooks/useUsuarios"; // Hook de autenticação
import Navbar from './Navbar';
import SidebarMenu from './SidebarMenu';
import Formulario from './Formulario';
import { UserGroupIcon, UserPlusIcon, PencilSquareIcon, UserMinusIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Usuario {
    login: string;
    nome: string;
    telefone: string;
    avatar: string;
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
                setErrorMessage(`Por que não começar a cadastrar novos usuários agora mesmo?`);
            } else {
                const mapeiaUsuarios = usuarios.map((usuario: any) => ({
                    login: usuario.login,
                    nome: usuario.nome,
                    telefone: usuario.telefone,
                    avatar: usuario.avatar
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

    const fields = [
        { label: 'Superior', name: 'isSuperior', type: 'checkbox', default: false },
        {
            label: 'Filial', name: 'filial', type: 'select', options: [
                { value: 'filial1', label: 'Filial 1' },
                { value: 'filial2', label: 'Filial 2' },
                { value: 'filial3', label: 'Filial 3' },
            ]
        },
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
                                                <li key={usuario.nome}>
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
                        <Route path="novo" element={
                            <div className="max-w-2xl rounded-md shadow-sm mx-auto">
                                <Formulario
                                    name={"Novo usuário"}
                                    fields={fields}
                                    onSubmit={(data: any) => registraUsuario({
                                        login: data.login,
                                        nome: data.nome,
                                        email: data.email,
                                        superiorId: localStorage.getItem('id')?.toString() ?? "",
                                        senha: data.senha,
                                        aniversario: new Date(data.aniversario).toISOString().split('T')[0],
                                        telefone: data.telefone,
                                        isSuperior: data.isSuperior ?? false,
                                        token: null,
                                        avatar: data.avatar,
                                        parametroId: data.parametroId ?? null,
                                        filialId: data.filialId ?? null
                                    })}
                                />
                            </div>
                        } />
                        <Route path="editar" element={
                            <div className="max-w-7xl mx-auto py-10">
                                <h2 className="text-3xl font-bold tracking-tight text-rose-600 py-10">Editar usuários</h2>
                                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Login</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Nome</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Telefone</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {usuarios.map((usuario) => (
                                                <tr key={usuario.login}>
                                                    <td className="px-4 py-2">
                                                        <img src={`/avatars/${usuario.avatar}`} alt="" className="h-12 w-12 rounded-full" />
                                                    </td>
                                                    <td className="px-4 py-2">{usuario.login}</td>
                                                    <td className="px-4 py-2">{usuario.nome}</td>
                                                    <td className="px-4 py-2">{usuario.telefone}</td>
                                                    <td className="px-4 py-2">
                                                        <button
                                                            onClick={() => abrirAtualizaModal(usuario)}
                                                            className="text-indigo-600 hover:text-indigo-900">
                                                            <PencilSquareIcon className='w-5 h-5 mr-2' />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-300 rounded-lg shadow-lg p-6">
                        <Formulario
                            name={`LOGIN: ${usuarioSelecionado?.login}`}
                            fields={[
                                { label: 'Nome', name: 'nome', type: 'text' },
                                { label: 'Telefone', name: 'telefone', type: 'tel' },
                            ]}
                            onSubmit={(data: any) => atualizaUsuario({
                                ...usuarioSelecionado,
                                nome: data.nome,
                                telefone: data.telefone,
                            })}
                        />
                        <button
                            className="mt-4 bg-transparent text-gray-950 py-2 px-4"
                            onClick={fecharAtualizaModal}>
                            Cancelar edição!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;
