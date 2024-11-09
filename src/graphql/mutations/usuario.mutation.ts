import { gql } from 'graphql-request';

export const EDITA_USUARIO = gql`
  mutation editaUsuario(
    $id: String!,
    $nome: String,
    $email: String,
    $superiorId: String,
    $senha: String,
    $aniversario: String,
    $telefone: String,
    $isSuperior: Boolean,
    $cep: String,
    $logradouro: String,
    $numero: String,
    $bairro: String,
    $localidade: String,
    $uf: String,
    $ibge: String,
    $token: String,
    $avatar: String,
    $filialId: String
  ) {
    editaUsuario(
      id: $id,
      nome: $nome,
      email: $email,
      superiorId: $superiorId,
      senha: $senha,
      aniversario: $aniversario,
      telefone: $telefone,
      isSuperior: $isSuperior,
      cep: $cep,
      logradouro: $logradouro,
      numero: $numero,
      bairro: $bairro,
      localidade: $localidade,
      uf: $uf,
      ibge: $ibge,
      token: $token,
      avatar: $avatar,
      filialId: $filialId
    ) {
      nome
      email
      superiorId
      aniversario
      telefone
      isSuperior
      cep
      logradouro
      numero
      bairro
      localidade
      uf
      ibge
      token
      avatar
      filialId
    }
  }
`;

export const APAGA_USUARIO = gql`
          mutation apagaUsuario($id: String!) {
            apagaUsuario(id: $id)
          }
        `;

export const APAGA_PARAMETROS = gql`
          mutation apagaParametros($usuarioId: String!) {
            apagaParametros(usuarioId: $usuarioId)
          }
        `;

export const BUSCA_PARAMETROS_USUARIO = gql`
query BuscaParametrosPorUsuarioId($usuarioId: String!) {
    buscaParametrosPorUsuarioId(usuarioId: $usuarioId) {
        usuarioId
        tela
        leitura
        escrita
        exclusao
        edicao
    }
}
`;

export const EDITA_PARAMETROS = gql`
mutation editaParametros(
  $usuarioId: String!,
  $parametros: [ParametroInput!]!
) {
  editaParametros(
    usuarioId: $usuarioId,
    parametros: $parametros
  ) {
    id
    usuarioId
    tela
    leitura
    escrita
    exclusao
    edicao
  }
}
`;

export const NOVO_USUARIO = gql`
  mutation novoUsuario(
    $login: String!,
    $status: Int!,
    $nome: String!,
    $email: String!,
    $superiorId: String!,
    $senha: String!,
    $aniversario: String!,
    $telefone: String!,
    $isSuperior: Boolean!,
    $cep: String,
    $logradouro: String,
    $numero: String,
    $bairro: String,
    $localidade: String,
    $uf: String,
    $ibge: String,
    $token: String,
    $avatar: String,
    $filialId: String
  ) {
    novoUsuario(
      login: $login,
      status: $status,
      nome: $nome,
      email: $email,
      superiorId: $superiorId,
      senha: $senha,
      aniversario: $aniversario,
      telefone: $telefone,
      isSuperior: $isSuperior,
      cep: $cep,
      logradouro: $logradouro,
      numero: $numero,
      bairro: $bairro,
      localidade: $localidade,
      uf: $uf,
      ibge: $ibge,
      token: $token,
      avatar: $avatar,
      filialId: $filialId
    ) {
      id
      login
      status
      nome
      email
      superiorId
      senha
      aniversario
      telefone
      isSuperior
      token
      avatar
      filialId
    }
  }
`;

export const NOVO_PARAMETRO = gql`
mutation novoParametro(
    $usuarioId: String!,
    $tela: String!,
    $leitura: Boolean!,
    $escrita: Boolean!,
    $exclusao: Boolean!,
    $edicao: Boolean!
) {
  novoParametro(
    usuarioId: $usuarioId,
    tela: $tela,
    leitura: $leitura,
    escrita: $escrita,
    exclusao: $exclusao,
    edicao: $edicao
  ) {
    usuarioId,
    tela,
    leitura,
    escrita,
    exclusao,
    edicao
  }
}
`;