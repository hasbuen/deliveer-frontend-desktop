import React from 'react';
import Toggle from '../../commons/UI/Toggle'; 
import { Permissao } from '../../types/permissoes.interface';

interface TabelaPermissoesProps {
  permissoes: Permissao[];
  togglePermissao: (index: number, permissao: keyof Permissao) => void;
}

const TabelaPermissoes: React.FC<TabelaPermissoesProps> = ({ permissoes, togglePermissao }) => (
  <table className="w-full text-sm text-left rtl:text-right text-rose-500 dark:text-rose-400">
    <thead className="text-xs uppercase bg-transparent text-black font-bold">
      <tr>
        <th scope="col" className="px-6 py-3">Tela</th>
        <th scope="col" className="px-6 py-3">Ver</th>
        <th scope="col" className="px-6 py-3">Criar</th>
        <th scope="col" className="px-6 py-3">Apagar</th>
        <th scope="col" className="px-6 py-3">Editar</th>
      </tr>
    </thead>
    <tbody>
      {permissoes.map((permissao, index) => (
        <tr key={permissao.tela}>
          <td className="px-6 py-4 text-black font-bold">{permissao.tela}</td>
          <td className="px-6 py-4 text-center">
            <Toggle
              type="checkbox"
              checked={permissao.leitura}
              onChange={() => togglePermissao(index, 'leitura')}
              activeColor="bg-amber-400"
              inactiveColor="bg-blue-400"
            />
          </td>
          <td className="px-6 py-4 text-center">
            <Toggle
              type="checkbox"
              checked={permissao.escrita}
              onChange={() => togglePermissao(index, 'escrita')}
              activeColor="bg-amber-400"
              inactiveColor="bg-blue-400"
            />
          </td>
          <td className="px-6 py-4 text-center">
            <Toggle
              type="checkbox"
              checked={permissao.exclusao}
              onChange={() => togglePermissao(index, 'exclusao')}
              activeColor="bg-amber-400"
              inactiveColor="bg-blue-400"
            />
          </td>
          <td className="px-6 py-4 text-center">
            <Toggle
              type="checkbox"
              checked={permissao.edicao}
              onChange={() => togglePermissao(index, 'edicao')}
              activeColor="bg-amber-400"
              inactiveColor="bg-blue-400"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TabelaPermissoes;