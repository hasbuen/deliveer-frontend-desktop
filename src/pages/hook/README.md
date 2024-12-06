# Hook `useUsuarios`

Este hook foi criado para buscar os parâmetros associados a um usuário logado no sistema, a partir do login armazenado no `localStorage`. Ele também lida com possíveis falhas (como sessão expirada ou erros no servidor), exibindo mensagens apropriadas ao usuário.

---

## Objetivo

- Buscar os parâmetros ou permissões associados a um usuário logado no sistema.
- Lidar com erros de autorização e exibir mensagens de feedback ao usuário.
- Facilitar o gerenciamento de carregamento durante a execução da operação.

---

## Passo a Passo do Funcionamento

1. **Estado de Carregamento (`loading`)**:
   - Controla se a aplicação está carregando os dados.
   - Útil para exibir um *spinner* ou bloquear interações enquanto a operação está em andamento.

2. **Obtenção do Cliente GraphQL**:
   - Usa uma instância de cliente GraphQL configurada (`getGraphQLClient()`) para enviar as requisições.

3. **Busca o ID do Usuário Baseado no Login**:
   - O login do usuário é recuperado do `localStorage` (`storedLogin`).
   - A função faz uma consulta GraphQL (`buscaUsuario`) para obter o ID associado ao login.

4. **Busca os Parâmetros do Usuário com Base no ID**:
   - Após obter o `usuarioId`, o hook realiza uma segunda requisição GraphQL (`BUSCA_PARAMETROS_USUARIO`) para obter os **parâmetros/permissões** associados a esse usuário.

5. **Lida com Erros**:
   - Caso o `storedLogin` esteja ausente ou a consulta falhe:
     - Se o erro for de autorização (`Unauthorized`):
       - Remove o token e o ID do `localStorage`.
       - Mostra um *toast* avisando que a sessão expirou.
       - Redireciona o usuário para a página de login (`navigate('/')`).
     - Para outros erros:
       - Exibe uma mensagem genérica ou específica, dependendo do retorno do servidor.
   - Se o erro ocorrer ao buscar os parâmetros, exibe um *toast* com o erro apropriado.

6. **Finaliza o Carregamento**:
   - Garante que o estado `loading` seja atualizado para `false`, mesmo que ocorra um erro.

---

## Retorno do Hook

O hook retorna dois valores principais:

1. **`loading`**:
   - Um indicador booleano que informa se a busca dos dados está em andamento.

2. **`carregaParametrosUsuario`**:
   - Uma função assíncrona que realiza todo o processo de busca e retorna:
     - Uma lista de permissões (`Permissao[]`) se a operação for bem-sucedida.
     - `false` caso ocorra algum erro durante a execução.

---

## Cenários de Uso

Este hook pode ser utilizado em componentes React para:

- Buscar as permissões de um usuário logado no sistema.
- Exibir mensagens de erro ou avisos de expiração de sessão.
- Bloquear ou permitir acesso a rotas/páginas com base nos parâmetros retornados.

---