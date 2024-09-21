import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Dashboard() {
  const [login, setLogin] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLogin = localStorage.getItem('login');
    if (!storedLogin) {
      navigate('/');
    } else {
      setLogin(storedLogin);
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-col">
      <Navbar login={login} logout={logout} />
      {/* Conteúdo Principal */}
      <main className="flex-1 p-10">
        <p>Conteúdo</p>
      </main>
    </div>
  );
}

export default Dashboard;