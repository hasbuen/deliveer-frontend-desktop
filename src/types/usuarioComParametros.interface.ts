export interface UsuarioComParametros {
    id: string;
    login: string;
    nome: string;
    email: string;
    telefone: string;
    isSuperior: boolean;
    cep: string;
    logradouro: string;
    numero: string;
    localidade: string;
    uf: string;
    ibge: string;
    avatar: string;
    filialId?: string;
    parametros?: Array<{
        usuarioId: string;
        tela: string;
        leitura: boolean;
        escrita: boolean;
        exclusao: boolean;
        edicao: boolean
    }>;
}