import React, { useEffect, useState } from 'react';
import { useEditaUsuario } from "./hook/useEditaUsuario";
import { useTodosUsuarios } from "../Todos/hook/useTodosUsuarios";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Formulario from '../../../commons/Formulario/Formulario';

interface Usuario {
    login: string;
    nome: string;
    email: string;
    telefone: string;
    avatar: string;
    isSuperior: boolean; // Mudança para booleano
}

const EditaUsuario: React.FC = () => {
    const { editaUsuario } = useEditaUsuario();
    const { todosUsuarios } = useTodosUsuarios();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const usuariosData = await todosUsuarios();
                const mapeiaUsuarios = usuariosData.map((usuario: any) => ({
                    login: usuario.login,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    avatar: usuario.avatar,
                    isSuperior: usuario.isSuperior
                }));
                setUsuarios(mapeiaUsuarios);
            } catch (error) {
                console.error("Erro ao carregar os usuários", error);
            }
        };
        carregarUsuarios();
    }, []);

    const abrirAtualizaModal = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };

    const fecharAtualizaModal = () => {
        setIsModalOpen(false);
        setUsuarioSelecionado(null);
    };

    const atualizaUsuario = async (formData: Usuario) => {
        try {
            await editaUsuario(formData);
            fecharAtualizaModal();
            setUsuarios(prev => 
                prev.map(usuario => 
                    usuario.login === formData.login ? { ...usuario, ...formData } : usuario
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar usuário", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight text-rose-600 py-10">Editar usuários</h2>
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-rose-400 text-black">
                        <tr>
                            <th scope="col"></th>
                            <th scope="col" className="px-4 py-2 text-left text-base font-bold capitalize tracking-wider">Login</th>
                            <th scope="col" className="px-4 py-2 text-left text-base font-bold capitalize tracking-wider">Nome</th>
                            <th scope="col" className="px-4 py-2 text-left text-base font-bold capitalize tracking-wider">Email</th>
                            <th scope="col" className="px-4 py-2 text-left text-base font-bold capitalize tracking-wider">Telefone</th>
                            <th scope="col" className="px-4 py-2 text-left text-base font-bold capitalize tracking-wider">Superior?</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-rose-200 divide-y divide-white">
                        {usuarios.map(usuario => (
                            <tr key={usuario.login} className='text-black'>
                                <td className="px-4 py-2">
                                    <img src={`/avatars/${usuario.avatar}`} alt={usuario.nome} className="h-12 w-12 rounded-full" />
                                </td>
                                <td className="px-4 py-2">{usuario.login}</td>
                                <td className="px-4 py-2">{usuario.nome}</td>
                                <td className="px-4 py-2">{usuario.email}</td>
                                <td className="px-4 py-2">{usuario.telefone}</td>
                                <td className="px-4 py-2">{usuario.isSuperior ? 'Sim' : 'Não'}</td>
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

            {isModalOpen && usuarioSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <Formulario
                            name={`Atualização`}
                            fields={[
                                { label: 'Nome', name: 'nome', type: 'text' },
                                { label: 'Email', name: 'email', type: 'email' },
                                { label: 'Telefone', name: 'telefone', type: 'tel' },
                            ]}
                            onSubmit={(data: any) => atualizaUsuario({
                                ...usuarioSelecionado,
                                nome: data.nome,
                                email: data.email,
                                telefone: data.telefone,
                            })}
                        />
                        <button
                            className="mt-4 ml-32 bg-gray-300 hover:bg-gray-400 text-rose-500 hover:text-rose-800 py-1 px-4 rounded-md shadow-sm mx-auto"
                            onClick={fecharAtualizaModal}>
                            Cancelar edição?
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditaUsuario;