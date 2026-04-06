import { LayoutDashboard, ReceiptText, LineChart, Settings, HelpCircle, LogOut, Wallet, X } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
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

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-text-primary">FinDash</span>
        </div>
        {/* Close button for mobile overlay */}
        <button
          onClick={onClose}
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={onClose}
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
          onClick={onClose}
          className={({ isActive }) => clsx(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left",
            isActive ? "text-brand-blue bg-surface-hover" : "text-text-secondary hover:text-text-primary hover:bg-surface"
          )}
        >
          <HelpCircle className="w-5 h-5" />
          Help Center
        </NavLink>
        <button onClick={() => { handleLogout(); onClose?.(); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors w-full text-left">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible on md+ */}
      <div className="w-64 bg-background border-r border-border h-full hidden md:flex flex-col shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Overlay Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Slide-in panel */}
          <div
            className="absolute top-0 left-0 bottom-0 w-72 bg-background border-r border-border flex flex-col shadow-2xl"
            style={{ animation: 'slideInLeft 0.25s ease-out' }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
