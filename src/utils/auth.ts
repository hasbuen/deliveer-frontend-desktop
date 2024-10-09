import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const checkAuthToken = () => {
  const navigate = useNavigate();
  console.log("ENTROU")

  localStorage.removeItem('token');

  // Redireciona o usuário para a tela de login
  navigate('/');

  // Mostra uma notificação de sessão expirada
  toast.error("Sessão expirada, faça login novamente.");
};