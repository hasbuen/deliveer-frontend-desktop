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
    superiorId: string;
    senha: string;
    aniversario: Date;
    telefone: string;
    isSuperior: boolean;
    cep: string | null;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    localidade: string | null;
    uf: string | null;
    ibge: string | null;
    token: string | null;
    avatar: string | null;
    parametroId: string | null;
    filialId: string | null;
}

const ApagaUsuario: React.FC = () => {
    const { apagaUsuario } = useApagaUsuario();
    const { todosUsuarios } = useTodosUsuarios();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>([]);

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
                    superiorId: usuario.superiorId || '',
                    senha: usuario.senha || '',
                    aniversario: usuario.aniversario || new Date(),
                    telefone: usuario.telefone,
                    isSuperior: usuario.isSuperior,
                    cep: usuario.cep || null,
                    logradouro: usuario.logradouro || null,
                    numero: usuario.numero || null,
                    bairro: usuario.bairro || null,
                    localidade: usuario.localidade || null,
                    uf: usuario.uf || null,
                    ibge: usuario.ibge || null,
                    token: usuario.token || null,
                    avatar: usuario.avatar || null,
                    parametroId: usuario.parametroId || null,
                    filialId: usuario.filialId || null,
                }));
                setUsuarios(mapeiaUsuarios as Usuario[]);
            } catch (error) {
                toast.error("Erro ao carregar usuários!");
            }
        };
        carregarUsuarios();
    }, []);

    const abrirDeletarModal = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };

    const fecharDeletarModal = () => {
        setIsModalOpen(false);
        setUsuarioSelecionado(null);
    };

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
                    onClick={() => deletarUsuario(usuariosSelecionados)}
                    disabled={usuariosSelecionados.length === 0}
                    className={`px-4 py-2 rounded-md transition-colors duration-500 ease-in-out ${usuariosSelecionados.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-rose-800 text-white hover:bg-rose-700 hover:text-white"
                        }`}>
                    Apagar Selecionados
                </button>
            </div>

            {isModalOpen && usuarioSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <button
                            onClick={fecharDeletarModal}
                            className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Fechar sem alterações!" />
                        <h3 className="text-lg font-semibold">Tem certeza que deseja apagar o usuário {usuarioSelecionado.nome}?</h3>
                        <div className="mt-4">
                            <button
                                onClick={() => deletarUsuario([usuarioSelecionado.id])}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                                Sim, apagar
                            </button>
                            <button
                                onClick={fecharDeletarModal}
                                className="ml-4 bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApagaUsuario;
