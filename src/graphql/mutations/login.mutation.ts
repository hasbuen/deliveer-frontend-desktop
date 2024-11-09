import { gql } from 'graphql-request';

export const LOGIN = gql`
  mutation login($login: String!, $senha: String!) {
    login(login: $login, senha: $senha) {
      access_token
      usuario {
        id
        login
        status
        nome
        avatar
        isSuperior
      }
    }
  }
`;

export const REDEFINE = gql`
  mutation Redefine($login: String!, $senha: String!, $superior: String!, $senhaSuperior: String!) {
    redefine(login: $login, senha: $senha, superior: $superior, senhaSuperior: $senhaSuperior) {
      id
      login
      token
    }
  }
`;