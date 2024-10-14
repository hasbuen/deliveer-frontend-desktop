import React, { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cepSearch } from '../../utils/cepSearch';

interface Field {
    label: string;
    name: string;
    value?: string;
    valueBool?: boolean;
    type: string;
}

interface Permissao {
    tela: string;
    criar: boolean;
    editar: boolean;
    apagar: boolean;
    visualizar: boolean;
}

interface FormularioProps {
    name: string;
    fields: Field[];
    onSubmit: (formData: { [key: string]: any }) => void;
    initialData?: { [key: string]: any };
}

const Formulario: React.FC<FormularioProps> = ({ name, fields, onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>(initialData);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [permissoes, setPermissoes] = useState<Permissao[]>([
        { tela: 'Cadastro de usuários', criar: false, editar: false, apagar: false, visualizar: false },
        { tela: 'Relatórios', criar: false, editar: false, apagar: false, visualizar: false },
        { tela: 'Configurações', criar: false, editar: false, apagar: false, visualizar: false },
    ]);

    useEffect(() => {
        const avatarImages = Array.from({ length: 20 }, (_, index) => `${index + 1}.png`);
        setAvatars(avatarImages);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prevState => ({
            ...prevState,
            [name]: isCheckbox ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const abrirModalPermissoes = () => {
        setIsModalOpen(true);
    };

    const fecharModalPermissoes = () => {
        setIsModalOpen(false);
    };

    const togglePermissao = (index: number, permissao: keyof Permissao) => {
        setPermissoes(prevPermissoes => {
            const novasPermissoes: Permissao[] = [...prevPermissoes];
            novasPermissoes[index] = {
                ...novasPermissoes[index],
                [permissao]: !novasPermissoes[index][permissao]
            };

            return novasPermissoes;
        });
    };

    const handleCepKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cep = formData['cep'];
            if (cep) {
                try {
                    const usuario = await cepSearch(cep);
                    setFormData(prevState => ({
                        ...prevState,
                        logradouro: usuario.logradouro,
                        bairro: usuario.bairro,
                        localidade: usuario.localidade,
                        uf: usuario.uf,
                        ibge: usuario.ibge
                    }));
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="col-span-1 sm:col-span-2 text-4xl font-bold text-rose-600 mb-4">{name}</h2>

            {fields.map((field) => (
                <div key={field.name} className="flex justify-center">

                    {field.type === 'checkbox' ? (
                        <div className="relative flex items-center sm:mx-2 mt-5">
                            <div className='flex flex-col ml-4'>
                                <label className='flex flex-row justify-center bg-rose-700 shadow-rose-800 shadow-lg cursor-pointer p-0'>
                                    <input
                                        type="checkbox"
                                        name={field.name}
                                        checked={formData[field.name] || false}
                                        onChange={handleChange}
                                    />
                                    <span className="text-white font-extrabold">{field.label}?</span>
                                </label>

                                <div className="flex items-center justify-center mt-4">
                                    <span className="text-rose-600 font-extrabold mr-4">Configurar permissões</span>
                                    <button
                                        type="button"
                                        onClick={abrirModalPermissoes}
                                        className="rounded-full border-2 shadow-black shadow-xl bg-black text-white font-semibold leading-6 hover:bg-rose-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-600 transition-colors duration-500 ease-in-out"
                                    >
                                        <AdjustmentsHorizontalIcon className="h-8 w-8 my-1 mx-1" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            ))};

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {name === 'Novo usuário' && fields.slice(1).map((field) => (
                    <div key={field.name} className={`flex flex-col ${field.name === 'avatar' ? 'sm:col-span-3' : 'sm:col-span-1'}`}>
                        {field.type !== 'checkbox' && (
                            <label htmlFor={field.name} className="text-sm font-medium text-rose-600">
                                {field.label}
                            </label>
                        )}

                        {field.name === 'avatar' ? (
                            <div className="h-40 w-full overflow-y-auto flex flex-wrap">
                                {avatars.map((avatar) => (
                                    <div key={avatar} className="flex flex-col items-center mb-2 mx-1">
                                        <img
                                            src={`/avatars/${avatar}`}
                                            alt={avatar}
                                            className={`w-14 h-14 rounded-full cursor-pointer border-2 ${formData.avatar === avatar ? 'border-rose-600' : 'border-transparent'} hover:border-rose-600`}
                                            onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : field.name === 'cep' ? (
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" aria-hidden="true" />
                                <input
                                    type="text"
                                    name="cep"
                                    value={formData['cep'] || ''}
                                    onChange={handleChange}
                                    onKeyDown={handleCepKeyDown}
                                    className="mt-1 block w-full rounded-lg p-2 pl-10 border-0 shadow-rose-800 shadow-sm bg-rose-200 text-black ring-1 ring-inset ring-rose-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-rose-800"
                                    placeholder="Digite o CEP"
                                />
                            </div>
                        ) : field.type !== 'checkbox' && (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg p-2 border-0 bg-rose-200 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600"
                            />
                        )}
                    </div>
                ))
                }

                {name === 'Atualização' && fields.map((field) => (
                    <div key={field.name} className={`flex flex-col ${field.name === 'avatar' ? 'sm:col-span-3' : 'sm:col-span-1'}`}>
                        {field.type !== 'checkbox' && (
                            <label htmlFor={field.name} className="text-sm font-medium text-rose-600">
                                {field.label}
                            </label>
                        )}

                        {field.name === 'avatar' ? (
                            <div className="h-40 w-full overflow-y-auto flex flex-wrap">
                                {avatars.map((avatar) => (
                                    <div key={avatar} className="flex flex-col items-center mb-2 mx-1">
                                        <img
                                            src={`/avatars/${avatar}`}
                                            alt={avatar}
                                            className={`w-14 h-14 rounded-full cursor-pointer border-2 ${formData.avatar === avatar ? 'border-rose-600' : 'border-transparent'} hover:border-rose-600`}
                                            onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : field.name === 'cep' ? (
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" aria-hidden="true" />
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData['cep'] || ''}
                                    onChange={handleChange}
                                    onKeyDown={handleCepKeyDown}
                                    className="mt-1 block w-full rounded-lg p-2 pl-10 border-0 shadow-rose-800 shadow-sm bg-rose-200 text-black ring-1 ring-inset ring-rose-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-rose-800"
                                    placeholder="Digite o CEP"
                                />
                            </div>
                        ) : field.type !== 'checkbox' && (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg p-2 border-0 bg-rose-200 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600"
                            />
                        )}
                    </div>
                ))
                }
            </div>
            <div className="mt-5 col-span-3 sm:col-span-2">
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-rose-600 px-4 py-2 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                    Salvar
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <button
                            onClick={fecharModalPermissoes}
                            className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Pronto?"
                        />
                        <h3 className="text-xl font-bold mb-4">Configurar Permissões</h3>
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-900">Tela</th>
                                    <th className="px-4 py-2 text-center text-sm font-bold text-gray-900">Criar</th>
                                    <th className="px-4 py-2 text-center text-sm font-bold text-gray-900">Editar</th>
                                    <th className="px-4 py-2 text-center text-sm font-bold text-gray-900">Apagar</th>
                                    <th className="px-4 py-2 text-center text-sm font-bold text-gray-900">Visualizar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissoes.map((permissao, index) => (
                                    <tr key={permissao.tela}>
                                        <td className="px-4 py-2">{permissao.tela}</td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={permissao.criar}
                                                onChange={() => togglePermissao(index, 'criar')}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={permissao.editar}
                                                onChange={() => togglePermissao(index, 'editar')}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={permissao.apagar}
                                                onChange={() => togglePermissao(index, 'apagar')}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={permissao.visualizar}
                                                onChange={() => togglePermissao(index, 'visualizar')}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </form>


    );
};

export default Formulario;
