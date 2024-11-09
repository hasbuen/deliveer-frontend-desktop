import React from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';


interface CampoCheckboxProps {
  field: any;
  formData: { [key: string]: any };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  abrirModalPermissoes: () => void;
  togglePermissao: (index: number, permissao: string) => void;
}

const Checkbox: React.FC<CampoCheckboxProps> = ({ field, formData, handleChange, abrirModalPermissoes, togglePermissao }) => (
  <div className="relative flex justify-between items-center sm:mx-0 mt-5 mb-8 w-full px-0">
    <div className="flex items-center space-x-2 bg-transparent p-2 cursor-pointer">
      <label className="flex items-center space-x-2 p-2 cursor-pointer">
        <span className="text-black font-extrabold">{field.label}?</span>
        <div className="relative inline-block w-16 h-4">
          <input
            type="checkbox"
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
            id={`toggle-${field.name}`}
            className="hidden"
          />
          <div
            className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-300
                ${formData[field.name] ? 'bg-amber-400' : 'bg-gray-300'}`}
          >
            <div
              className={`w-5 h-5 bg-gray-500 rounded-full shadow-md transform transition-transform duration-300 
                    ${formData[field.name] ? 'translate-x-5' : 'translate-x-0'}`}
            ></div>
          </div>
        </div>
      </label>
    </div>
    <a
      onClick={abrirModalPermissoes}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-300 text-rose-600 font-extrabold cursor-pointer transition-colors duration-300 hover:bg-rose-200"
    >
      <span>Configurar permissões</span>
      <AdjustmentsHorizontalIcon className="h-6 w-6 text-rose-600" aria-hidden="true" />
    </a>
  </div>
);

export default Checkbox;
