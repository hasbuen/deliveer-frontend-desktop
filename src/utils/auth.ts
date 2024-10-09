// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    // Verifique se o token existe e se é válido, você pode adicionar validações adicionais aqui
    return !!token;
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('token');
  };  