export interface Usuario {
    id: string;
    login: string;
    status: number;
    nome: string;
    email: string;
    superiorId: string;
    senha: string;
    aniversario: Date;
    telefone: string;
    isSuperior: boolean;
    cep: string | null;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    localidade: string | null;
    uf: string | null;
    ibge: string | null;
    token: string | null;
    avatar: string | null;
    filialId: string | null;
  }