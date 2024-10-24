import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodosUsuarios } from "./hook/useTodosUsuarios";
import { InformationCircleIcon, MapPinIcon } from '@heroicons/react/24/outline'; // Ícone de informação
import { Tooltip } from 'react-tooltip'; // Um exemplo de componente de tooltip

const TodosUsuarios: React.FC = () => {
    const navigate = useNavigate();
    const { todosUsuarios, loading } = useTodosUsuarios();
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
                    isSuperior: usuario.isSuperior,
                    cep: usuario.cep,
                    logradouro: usuario.logradouro,
                    numero: usuario.numero,
                    localidade: usuario.localidade,
                    uf: usuario.uf,
                    ibge: usuario.ibge
                }));
                setUsuarios(mapeiaUsuarios);
                setErrorMessage(null);
            }
        }).catch(error => {
            console.error("Erro ao carregar os usuários", error);
            setErrorMessage("Erro ao carregar os usuários.");
        });

    }, [navigate]);

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
                                <div className="relative flex items-center gap-x-6">
                                    <div className="relative">
                                        <img alt="" src={`/avatars/${usuario.avatar}`} className="h-16 w-16 rounded-full" />

                                        <span className="absolute -top-5 -right-1 inline-flex items-center justify-center rounded-full text-xs">
                                            <InformationCircleIcon
                                                className="h-6 w-6 text-blue-700 font-bold cursor-pointer"
                                                data-tooltip-id={`tooltip-${usuario.login}`}
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{usuario.nome}</h3>
                                        <p className="text-sm font-semibold leading-6 text-indigo-600">{usuario.telefone}</p>
                                    </div>
                                    <Tooltip
                                        id={`tooltip-${usuario.login}`}
                                        className="shadow-lg p-4 rounded-lg"
                                        style={{ backgroundColor: '#dad7cd', color: 'black' }}
                                    >
                                        <p className='text-lg'>
                                            {usuario.cep || usuario.logradouro || usuario.numero || usuario.localidade || usuario.uf ? (
                                                <span className="flex items-center">
                                                    <MapPinIcon className='h-5 w-5 text-blue-700 font-bold mr-1' />
                                                    {`${usuario.cep} ${usuario.logradouro} ${usuario.numero} ${usuario.localidade} ${usuario.uf}`}
                                                </span>
                                            ) : (
                                                "Não foi informado o endereço no cadastro"
                                            )}
                                        </p>
                                    </Tooltip>
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
