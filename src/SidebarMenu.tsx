import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { SVGProps, FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
    name: string;
    href: string;
    icon: FC<SVGProps<SVGSVGElement>>; 
}

interface SidebarMenuProps {
    title: string;
    menuItems: MenuItem[];
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    icon: FC<SVGProps<SVGSVGElement>>; 
}

const SidebarMenu: FC<SidebarMenuProps> = ({ title, menuItems, isCollapsed, setIsCollapsed, icon: TitleIcon }) => {
    const navigate = useNavigate();

    const handleNavigation = (href: string) => {
        navigate(href);
    };

    return (
        <aside className={`bg-gray-100 transition-width duration-500 p-3 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex justify-between items-center mb-6">
                <div className={`inline-flex items-center gap-x-1 p-4 text-2xl font-semibold leading-6 text-gray-900 ${isCollapsed && 'justify-center'}`}>
                    {TitleIcon && <TitleIcon className="h-6 w-6 text-rose-600" />}
                    {!isCollapsed && <span>{title}</span>}
                </div>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg bg-rose-100 hover:bg-rose-50">
                    {isCollapsed ? (
                        <ChevronDoubleRightIcon className="h-6 w-6 text-gray-600" />
                    ) : (
                        <ChevronDoubleLeftIcon className="h-6 w-6 text-gray-600" />
                    )}
                </button>
            </div>
            <div className="space-y-2">
                {menuItems.map(item => (
                    <div key={item.name} className="group relative flex items-center rounded-lg p-2 hover:bg-gray-200 transition">
                        <button onClick={() => handleNavigation(item.href)} className="flex items-center">
                            <item.icon className="h-6 w-6 text-gray-600 mr-2 group-hover:text-rose-600" />
                            {!isCollapsed && (
                                <span className="font-semibold text-gray-900">
                                    {item.name}
                                </span>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarMenu;