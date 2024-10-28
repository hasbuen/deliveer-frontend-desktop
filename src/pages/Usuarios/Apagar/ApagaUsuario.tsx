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
            <h2 className="text-3xl font-bold tracking-tight text-rose-600 py-10">Gerenciar usuários</h2>
            <div className="border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-rose-400 text-black">
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    checked={usuarios.length > 0 && usuariosSelecionados.length === usuarios.length}
                                    onChange={() => setUsuariosSelecionados(
                                        usuariosSelecionados.length === usuarios.length ? [] : usuarios.map(usuario => usuario.id)
                                    )}
                                />
                            </th>
                            <th scope="col" className="px-4 py-2 text-center text-base font-bold capitalize tracking-wider">Avatar</th>
                            <th scope="col" className="px-4 py-2 text-center text-base font-bold capitalize tracking-wider">Login</th>
                            <th scope="col" className="px-4 py-2 text-center text-base font-bold capitalize tracking-wider">Nome</th>
                            <th scope="col" className="px-4 py-2 text-center text-base font-bold capitalize tracking-wider">Email</th>
                            <th scope="col" className="px-4 py-2 text-center text-base font-bold capitalize tracking-wider">Telefone</th>
                            <th scope="col" className="px-4 py-2 text-center text-base font-bold capitalize tracking-wider">Superior?</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                </table>
                <div className="overflow-y-auto h-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <tbody className="bg-pink-200">
                            {usuarios.map(usuario => (
                                <tr key={usuario.id} className='text-black'>
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={usuariosSelecionados.includes(usuario.id)}
                                            onChange={() => toggleSelecionado(usuario.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <img src={`/avatars/${usuario.avatar}`} alt={usuario.nome} className="h-12 w-12 rounded-full" />
                                    </td>
                                    <td className="px-4 py-2">{usuario.login}</td>
                                    <td className="px-4 py-2">{usuario.nome}</td>
                                    <td className="px-4 py-2">{usuario.email}</td>
                                    <td className="px-4 py-2">{usuario.telefone}</td>
                                    <td className="px-4 py-2">{usuario.isSuperior ? <CheckIcon className="h-6 w-6 text-green-500 font-bold" /> : <XMarkIcon className="h-6 w-6 text-red-500 font-bold" />}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => abrirDeletarModal(usuario)}
                                            className="text-red-600 hover:text-red-900">
                                            <TrashIcon className='w-5 h-5 mr-2' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4">
            <button
        onClick={() => deletarUsuario(usuariosSelecionados)}
        disabled={usuariosSelecionados.length === 0} // Desabilita o botão se nenhum usuário estiver selecionado
        className={`px-4 py-2 rounded-md transition-colors duration-500 ease-in-out ${
            usuariosSelecionados.length === 0 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Estilos desabilitados
                : "bg-transparent text-rose-700 hover:bg-rose-700 hover:text-white" // Estilos habilitados
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
                            title="Fechar sem salvar!">X</button>
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
