// src/pages/Usuarios/MonitorarUsuario.tsx

interface Usuario {
    id: string; 
    nome: string;
}

interface MonitoraUsuarioProps {
    usuario: any;
}

const MonitorarUsuario: React.FC<MonitoraUsuarioProps> = ({ usuario }) => {
    if (!usuario) {
        return <div>Usuário não encontrado.</div>; 
    }

    return (
        <div>
            <h2>Monitorando: {usuario.nome}</h2>
            {/* Aqui você pode incluir informações relevantes sobre o usuário */}
            {/* Exemplo: */}
            <p>ID do usuário: {usuario.id}</p>
            {/* Adicione outras informações do usuário aqui */}
        </div>
    );
};

export default MonitorarUsuario;