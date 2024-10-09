import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

function Dashboard() {
  const [avatar, setAvatar] = useState<string>("");
  const [login, setLogin] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAvatar = localStorage.getItem('avatar') || "default.png";
    const storedLogin = localStorage.getItem('login');
    if (!storedLogin) {
      navigate('/');
    } else {
      setAvatar(storedAvatar);
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
      <Navbar avatar={avatar} login={login} logout={logout} />
      {/* Conteúdo Principal */}
      <main className="flex-1 p-10">
        <p>Conteúdo</p>
      </main>
    </div>
  );
}

export default Dashboard;