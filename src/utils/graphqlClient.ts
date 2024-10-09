// src/utils/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';

const getGraphQLClient = () => {
  const token = localStorage.getItem('token');

  return new GraphQLClient('http://148.113.204.23:3000/graphql', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default getGraphQLClient;