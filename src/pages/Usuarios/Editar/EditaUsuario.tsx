import React, { useEffect, useState } from 'react';
import { useEditaUsuario } from "./hook/useEditaUsuario";
import { useTodosUsuarios } from "../Todos/hook/useTodosUsuarios";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

import Formulario from '../Formulario';
import { errors } from '../../../constants/messages/errors';
import { UsuarioComParametros } from '../../../types/usuarioComParametros.interface';

const EditaUsuario: React.FC = () => {
    const { editaUsuario } = useEditaUsuario();
    const { todosUsuarios } = useTodosUsuarios();
    const [usuarios, setUsuarios] = useState<UsuarioComParametros[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioComParametros | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const usuariosData = await todosUsuarios();
                const mapeiaUsuarios = usuariosData.map((usuario: any) => ({
                    id: usuario.id,
                    login: usuario.login,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    isSuperior: usuario.isSuperior,
                    cep: usuario.cep,
                    logradouro: usuario.logradouro,
                    numero: usuario.numero,
                    localidade: usuario.localidade,
                    uf: usuario.uf,
                    ibge: usuario.ibge,
                    avatar: usuario.avatar,
                    filialId: usuario.filialId,
                }));
                setUsuarios(mapeiaUsuarios);
            } catch (error) {
                toast.error(errors.CARREGAR_USUARIOS);
            }
        };
        carregarUsuarios();
    }, []);

    const abrirAtualizaModal = (usuario: UsuarioComParametros) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };

    const fecharAtualizaModal = () => {
        setIsModalOpen(false);
        setUsuarioSelecionado(null);
    };

    const atualizaUsuario = async (formData: UsuarioComParametros) => {
        try {
            await editaUsuario(formData);
            fecharAtualizaModal();
            setUsuarios(prev =>
                prev.map(usuario =>
                    usuario.login === formData.login ? { ...usuario, ...formData } : usuario
                )
            );
        } catch (error) {
            toast.error("Erro ao atualizar usuário!");
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight text-rose-600 py-10">Editar usuários</h2>
            
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-rose-500 dark:text-rose-400">
                        <thead className="text-xs uppercase bg-transparent text-black font-bold">
                            <tr>
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
                                <tr key={usuario.login}>
                                    <th scope="row" className="px-6 py-4 font-medium bg-transparent text-black whitespace-nowrap">
                                        <img src={`/avatars/${usuario.avatar}`} alt={usuario.nome} className="h-12 w-12 rounded-full" />
                                    </th>
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
                                    <td className="px-6 py-4 bg-transparent">
                                        <button
                                            onClick={() => abrirAtualizaModal(usuario)}
                                            className="text-indigo-600 hover:text-indigo-900">
                                            <PencilSquareIcon className="w-5 h-5 mr-2" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            {isModalOpen && usuarioSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <button
                            onClick={fecharAtualizaModal}
                            className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Fechar sem salvar!"
                        />
                        <Formulario
                            name={`Atualização`}
                            fields={[
                                { label: 'Superior', name: 'isSuperior', valueBool: usuarioSelecionado.isSuperior, type: 'checkbox' },
                                { label: 'Nome', name: 'nome', value: usuarioSelecionado.nome, type: 'text' },
                                { label: 'Email', name: 'email', value: usuarioSelecionado.email, type: 'email' },
                                { label: 'Telefone', name: 'telefone', value: usuarioSelecionado.telefone, type: 'tel' },
                                { label: 'CEP', name: 'cep', value: usuarioSelecionado.cep, type: 'text' },
                                { label: 'Logradouro', name: 'logradouro', value: usuarioSelecionado.logradouro, type: 'text' },
                                { label: 'Numero', name: 'numero', value: usuarioSelecionado.numero, type: 'text' },
                                { label: 'Localidade', name: 'localidade', value: usuarioSelecionado.localidade, type: 'text' },
                                { label: 'UF', name: 'uf', value: usuarioSelecionado.uf, type: 'text' },
                                { label: 'IBGE', name: 'ibge', value: usuarioSelecionado.ibge, type: 'text' },
                                { label: 'Avatar', name: 'avatar', value: usuarioSelecionado.avatar, type: 'file' }
                            ]}
                            onSubmit={(data: any) => atualizaUsuario({
                                ...usuarioSelecionado,
                                nome: data.nome,
                                email: data.email,
                                telefone: data.telefone,
                                cep: data.cep,
                                logradouro: data.logradouro,
                                numero: data.numero,
                                localidade: data.localidade,
                                uf: data.uf,
                                ibge: data.ibge,
                                avatar: data.avatar,
                                filialId: usuarioSelecionado.filialId,
                                parametros: data.parametros
                            })}
                            initialData={usuarioSelecionado}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditaUsuario;