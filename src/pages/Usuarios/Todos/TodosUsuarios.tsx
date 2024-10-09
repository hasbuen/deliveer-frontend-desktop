// src/pages/Usuarios/Todos/TodosUsuarios.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodosUsuarios } from "./hook/useTodosUsuarios";

const TodosUsuarios: React.FC = () => {
    const navigate = useNavigate(); // Inicializando o useNavigate
    const { todosUsuarios, loading } = useTodosUsuarios(); // Ajustado para usar a estrutura correta
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
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

    }, [navigate]); // Dependências adicionadas

    return (
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
    );
};

export default TodosUsuarios;