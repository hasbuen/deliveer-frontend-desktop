import axios from 'axios';
import { errors } from '../constants/messages/errors';

export const cepSearch = async (cep: string) => {
  if (!cep || cep.length !== 8) {
    throw new Error('CEP inválido');
  }

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;

    if (data.erro) {
      throw new Error(errors.CARREGAR_CEP);
    }

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      cidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge
    };
  } catch (error) {
    throw new Error(errors.BUSCAR_CEP);
  }
};