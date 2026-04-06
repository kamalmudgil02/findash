import { LayoutDashboard, ReceiptText, LineChart, Settings, HelpCircle, LogOut, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Transactions', icon: ReceiptText, path: '/transactions' },
    { label: 'Analytics', icon: LineChart, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 bg-background border-r border-border h-full flex flex-col hidden md:flex shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
          <Wallet className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-text-primary">FinDash</span>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left",
              isActive 
                ? "bg-surface-hover text-brand-blue" 
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            )}
            end={item.path === '/'}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-2">
        <NavLink 
          to="/help" 
          className={({ isActive }) => clsx(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left",
            isActive ? "text-brand-blue bg-surface-hover" : "text-text-secondary hover:text-text-primary hover:bg-surface"
          )}
        >
          <HelpCircle className="w-5 h-5" />
          Help Center
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors w-full text-left">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
