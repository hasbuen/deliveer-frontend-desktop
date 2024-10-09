import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { UserGroupIcon, XMarkIcon, BellIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface NavbarProps {
    avatar: string;
    login: string | null;
    logout: () => void;
}

const solutions = [
    { name: 'Usuários ⭐', description: 'Controle os usuários, removendo-os quando necessário e dando as permissões necessárias como quiser!', href: '/usuarios', icon: UserGroupIcon },
];

const Navbar: React.FC<NavbarProps> = ({ avatar, login, logout }) => {
    const [notifications, setNotifications] = useState<number>(5); // Exemplo: 5 notificações
    return (
        <header className="bg-transparent p-4 text-rose-600 flex justify-between items-center">
            <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-600 relative" />
                {notifications > 0 && (
                    <span className="relative -top-4 -right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-white text-xs">
                        {notifications}
                    </span>
                )}
            </div>
            <div className="flex items-center">
                <div className="flex items-center">
                    <span className="relative top-4 -right-9 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-600 text-white text-xs">
                        {status}
                    </span>
                </div>
                <img
                    src={`/avatars/${avatar}`}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full mr-2"
                />

                <h1 className="text-xl font-bold">{login}</h1>

            </div>
            <div className="flex items-center">

                <Popover className="relative">
                    <PopoverButton
                        onClick={() => window.location.href = '/dashboard'} // Redireciona para o dashboard
                        className="inline-flex items-center gap-x-1 p-4 text-sm font-semibold leading-6 text-gray-900"
                    >
                        <HomeIcon className="h-5 w-5" aria-hidden="true" />
                    </PopoverButton>

                </Popover>

                <Popover className="relative">
                    <PopoverButton className="inline-flex items-center gap-x-1 p-4 text-sm font-semibold leading-6 text-gray-900">
                        <span>Configurações</span>
                        <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
                    </PopoverButton>

                    <PopoverPanel className="absolute right-0 z-10 mt-5 flex w-screen max-w-max px-4">
                        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                            <div className="p-4">
                                {solutions.map((item) => (
                                    <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <item.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-rose-600" />
                                        </div>
                                        <div>
                                            <a href={item.href} className="font-semibold text-gray-900">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                            <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverPanel>
                </Popover>
                <button
                    onClick={logout}
                    className="bg-transparent px-4 py-2 rounded hover:bg-gray-200 flex items-center"
                >
                    <XMarkIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Sair
                </button>
            </div>
        </header>
    );
};

export default Navbar;