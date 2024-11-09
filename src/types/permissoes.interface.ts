export interface Permissao {
    usuarioId: string;
    tela: string;
    leitura: boolean;
    escrita: boolean;
    exclusao: boolean;
    edicao: boolean;
}