import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface Usuario {
    login: string;
    nome: string;
    email: string;
    telefone: string;
    avatar: string;
    isSuperior: string;
}

interface EditaUsuarioProps {
    usuarioSelecionado: Usuario | null; // Permitir que seja nulo ao inicializar
    usuarios: Usuario[];
    onUpdate: (usuario: Usuario) => void; // Callback para atualização do usuário
}

const EditaUsuario: React.FC<EditaUsuarioProps> = ({ usuarioSelecionado, usuarios, onUpdate }) => {
    const [formData, setFormData] = React.useState<Usuario | null>(usuarioSelecionado);
    const [isModalOpen, setIsModalOpen] = React.useState(false); // Estado para controlar a visibilidade do modal

    React.useEffect(() => {
        setFormData(usuarioSelecionado);
    }, [usuarioSelecionado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => (prevState ? { ...prevState, [name]: value } : null));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onUpdate(formData); // Chama o callback para atualizar o usuário
            setIsModalOpen(false); // Fecha o modal após atualizar
        }
    };

    const openModal = (usuario: Usuario) => {
        setFormData(usuario); // Preenche o formulário com os dados do usuário selecionado
        setIsModalOpen(true); // Abre o modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Fecha o modal
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight text-rose-600 py-10">Editar usuários</h2>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h3 className="text-lg font-bold mb-4">Editar Usuário</h3>
                        {formData && (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                        <input
                                            type="tel"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Superior?</label>
                                        <select
                                            name="isSuperior"
                                            value={formData.isSuperior}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        >
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mr-2 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700"
                                    >
                                        Atualizar Usuário
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

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
                        {usuarios.map((usuario) => (
                            <tr key={usuario.login} className='text-black'>
                                <td className="px-4 py-2">
                                    <img src={`/avatars/${usuario.avatar}`} alt="" className="h-12 w-12 rounded-full" />
                                </td>
                                <td className="px-4 py-2">{usuario.login}</td>
                                <td className="px-4 py-2">{usuario.nome}</td>
                                <td className="px-4 py-2">{usuario.email}</td>
                                <td className="px-4 py-2">{usuario.telefone}</td>
                                <td className="px-4 py-2">{usuario.isSuperior}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => openModal(usuario)} // Abre o modal com os dados do usuário
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <PencilSquareIcon className='w-5 h-5 mr-2' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditaUsuario;