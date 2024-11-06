import React, { useEffect, useState } from 'react';
import { useApagaUsuario } from "./hook/useApagaUsuario";
import { useTodosUsuarios } from "../Todos/hook/useTodosUsuarios";
import { TrashIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

interface Usuario {
    id: string;
    login: string;
    status: number;
    nome: string;
    email: string;
    telefone: string;
    isSuperior: boolean;
    avatar: string | null;
}

const ApagaUsuario: React.FC = () => {
    const { apagaUsuario } = useApagaUsuario();
    const { todosUsuarios } = useTodosUsuarios();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>([]);
    const [confirmacao, setConfirmacao] = useState(""); // Estado para confirmação ("concordo")
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const usuariosData = await todosUsuarios();
                const mapeiaUsuarios = usuariosData.map((usuario: any) => ({
                    id: usuario.id,
                    login: usuario.login,
                    status: usuario.status || 0,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    isSuperior: usuario.isSuperior,
                    avatar: usuario.avatar || null,
                }));
                setUsuarios(mapeiaUsuarios as Usuario[]);
            } catch (error) {
                toast.error("Erro ao carregar usuários!");
            }
        };
        carregarUsuarios();
    }, []);

    // Função para abrir o modal de exclusão de um usuário específico
    const abrirDeletarModal = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const fecharDeletarModal = () => {
        setIsModalOpen(false);
        setUsuarioSelecionado(null);
    };

    // Função para deletar o usuário
    const deletarUsuario = async (ids: string[]) => {
        try {
            for (const id of ids) {
                await apagaUsuario(id);
            }
            fecharDeletarModal();
            setUsuarios(prev => prev.filter(usuario => !ids.includes(usuario.id)));
            setUsuariosSelecionados([]);
        } catch (error) {
            toast.error("Erro ao apagar usuários!");
        }
    };

    const toggleSelecionado = (id: string) => {
        setUsuariosSelecionados(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight text-rose-600 py-10">Apagar usuários</h2>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-rose-500 dark:text-rose-400">
                    <thead className="text-xs uppercase bg-transparent text-black font-bold">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <label className="relative inline-block w-6 h-6">
                                    <input
                                        type="checkbox"
                                        checked={usuarios.length > 0 && usuariosSelecionados.length === usuarios.length}
                                        onChange={() => setUsuariosSelecionados(
                                            usuariosSelecionados.length === usuarios.length ? [] : usuarios.map(usuario => usuario.id)
                                        )}
                                        className="opacity-0 absolute w-0 h-0"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded-full border-1
                                ${usuariosSelecionados.length === usuarios.length ? 'bg-red-500' : 'bg-blue-500'}
                                transition-all duration-300 cursor-pointer`}
                                    />
                                </label>
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                            <th scope="col" className="px-6 py-3">Login</th>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Telefone</th>
                            <th scope="col" className="px-6 py-3">Superior?</th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td className="px-6 py-4 bg-transparent text-black">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={usuariosSelecionados.includes(usuario.id)}
                                            onChange={() => toggleSelecionado(usuario.id)}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => toggleSelecionado(usuario.id)}
                                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 
                                    ${usuariosSelecionados.includes(usuario.id) ? 'bg-red-500' : 'bg-blue-400'}`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-gray-700 rounded-full shadow-md transform transition-transform duration-300 
                                        ${usuariosSelecionados.includes(usuario.id) ? 'translate-x-5' : 'translate-x-0'}`}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 bg-transparent text-black">
                                    <img src={`/avatars/${usuario.avatar}`} alt={usuario.nome} className="h-12 w-12 rounded-full" />
                                </td>
                                <td className="px-6 py-4 bg-rose-200 text-black">{usuario.login}</td>
                                <td className="px-6 py-4 bg-rose-200 text-black">{usuario.nome}</td>
                                <td className="px-6 py-4 bg-rose-200 text-black">{usuario.email}</td>
                                <td className="px-6 py-4 bg-rose-200 text-black">{usuario.telefone}</td>
                                <td className="px-6 py-4 bg-rose-200 text-black">
                                    {usuario.isSuperior ? (
                                        <CheckIcon className="h-6 w-6 text-green-700 font-bold" />
                                    ) : (
                                        <XMarkIcon className="h-6 w-6 text-red-500 font-bold" />
                                    )}
                                </td>
                                <td className="px-6 py-4 bg-transparent text-black">
                                    <button
                                        onClick={() => abrirDeletarModal(usuario)}
                                        className="text-red-600 hover:text-red-900">
                                        <TrashIcon className="w-5 h-5 mr-2" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <button
                    onClick={() => {
                        if (usuariosSelecionados.length > 1) {
                            setModalAberto(true);
                        } else {
                            deletarUsuario(usuariosSelecionados);
                        }
                    }}
                    disabled={usuariosSelecionados.length === 0}
                    className={`px-4 py-2 rounded-md transition-colors duration-500 ease-in-out ${usuariosSelecionados.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-rose-800 text-white hover:bg-rose-700 hover:text-white"
                        }`}>
                    Apagar Selecionados (x{usuariosSelecionados.length})
                </button>
            </div>

            {/* Modal de confirmação */}
            {modalAberto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <button
                            onClick={() => setModalAberto(false)}
                            className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-700"/>
                        <h2 className="text-xl font-bold">Confirmar Exclusão</h2>
                        <p className="mt-4">Você tem certeza que deseja excluir os usuários selecionados?</p>
                        <input
                            type="text"
                            value={confirmacao}
                            onChange={(e) => setConfirmacao(e.target.value)}
                            placeholder="Digite 'concordo' para confirmar"
                            className="mt-4 px-4 py-2 border rounded-md text-sm w-full"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => {
                                    if (confirmacao.toLowerCase() === "concordo") {
                                        deletarUsuario(usuariosSelecionados);
                                        setModalAberto(false);
                                    } else {
                                        toast.error("Você deve digitar 'concordo' para continuar.");
                                    }
                                }}
                                disabled={confirmacao.toLowerCase() !== "concordo"}
                                className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para confirmação de um único usuário */}
            {isModalOpen && usuarioSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <button
                            onClick={fecharDeletarModal}
                            className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-700"/>
                        <h2 className="text-xl font-bold">Confirmar Exclusão</h2>
                        <p className="mt-4">Você tem certeza que deseja excluir o usuário {usuarioSelecionado.login}?</p>
                        <input
                            type="text"
                            value={confirmacao}
                            onChange={(e) => setConfirmacao(e.target.value)}
                            placeholder="Digite 'concordo' para confirmar"
                            className="mt-4 px-4 py-2 border rounded-md text-sm w-full"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => {
                                    if (confirmacao.toLowerCase() === "concordo") {
                                        deletarUsuario([usuarioSelecionado.id]);
                                        fecharDeletarModal();
                                    } else {
                                        toast.error("Você deve digitar 'concordo' para continuar.");
                                    }
                                }}
                                disabled={confirmacao.toLowerCase() !== "concordo"}
                                className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApagaUsuario;
