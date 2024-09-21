import React, { useState, useEffect } from 'react';

interface Field {
    label: string;
    name: string;
    type: string; 
}

interface FormularioProps {
    fields: Field[];
    onSubmit: (formData: { [key: string]: any }) => void;
    initialData?: { [key: string]: any };
}

const Formulario: React.FC<FormularioProps> = ({ fields, onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>(initialData);
    const [avatars, setAvatars] = useState<string[]>([]);

    useEffect(() => {
        const avatarImages = Array.from({ length: 20 }, (_, index) => `${index + 1}.png`);
        setAvatars(avatarImages);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
                <div key={field.name} className="flex flex-col mb-4">
                    <label htmlFor={field.name} className="block text-sm font-medium text-rose-600">{field.label}</label>
                    {field.name === 'avatar' ? (
                        <div className="h-40 overflow-y-auto flex flex-wrap">
                            {avatars.map((avatar) => (
                                <div key={avatar} className="flex flex-col items-center mb-2 mx-1">
                                    <img
                                        src={`/avatars/${avatar}`} // Ajuste o caminho conforme necessário
                                        alt={avatar}
                                        className={`w-16 h-16 rounded-full cursor-pointer border-2 ${formData.avatar === avatar ? 'border-rose-600' : 'border-transparent'} hover:border-rose-600`}
                                        onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg p-2 border-0 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600"
                        />
                    )}
                </div>
            ))}
            <div className="col-span-1 sm:col-span-2">
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-rose-600 px-4 py-2 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-fuchsia-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600"
                >
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default Formulario;