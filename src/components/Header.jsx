import { Search, Sun, Bell, User, Moon, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useState, useMemo, useEffect, useRef } from 'react';
import { FAQs } from '../data/faqs';

export default function Header({ role, setRole, onMenuToggle }) {
  const { isDarkMode, toggleTheme, user, transactions, notifications } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  const unreadCount = notifications?.filter(n => !n.read)?.length || 0;

  const firstName = user?.name?.split(' ')[0] || user?.name || 'there';
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      let salutation;
      if (hour >= 5 && hour < 12) salutation = 'Good Morning';
      else if (hour >= 12 && hour < 17) salutation = 'Good Afternoon';
      else salutation = 'Good Evening';
      setGreeting(`${salutation}, ${firstName}`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [firstName]);

  // Close mobile search when clicking outside
  useEffect(() => {
    if (!showMobileSearch) return;
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowMobileSearch(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMobileSearch]);
  
  const searchResults = useMemo(() => {
    if (!searchQuery) return { txs: [], faqs: [] };
    
    const lowerQuery = searchQuery.toLowerCase();
    
    const matchedTxs = transactions.filter(tx => 
       tx.description.toLowerCase().includes(lowerQuery) || 
       tx.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);
    
    const matchedFaqs = FAQs.filter(faq => 
       faq.question.toLowerCase().includes(lowerQuery) || 
       (faq.answer && faq.answer.toLowerCase().includes(lowerQuery))
    ).slice(0, 3);
    
    return { txs: matchedTxs, faqs: matchedFaqs };
  }, [searchQuery, transactions]);

  const searchDropdown = searchQuery && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border shadow-2xl rounded-xl p-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto z-[60]">
      
      {searchResults.txs.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Transactions</h4>
          <div className="flex flex-col gap-2">
            {searchResults.txs.map(tx => (
               <div key={tx.id} className="bg-background border border-border p-2 rounded-lg flex justify-between items-center text-sm">
                  <span className="text-text-primary font-medium truncate w-3/5">{tx.description}</span>
                  <span className={clsx("font-bold shrink-0", tx.amount > 0 ? "text-brand-green" : "text-text-primary")}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
               </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.faqs.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Help Center (FAQ)</h4>
          <div className="flex flex-col gap-2">
            {searchResults.faqs.map(faq => (
               <div key={faq.id} className="bg-background border border-border p-3 rounded-lg text-sm">
                  <p className="text-brand-blue font-medium mb-1">{faq.question}</p>
                  <p className="text-text-secondary line-clamp-2">{faq.answer || faq.click}</p>
               </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.txs.length === 0 && searchResults.faqs.length === 0 && (
         <div className="p-4 text-center text-text-secondary text-sm">
           No results found for "{searchQuery}"
         </div>
      )}
    </div>
  );

  return (
    <header className="h-16 md:h-20 border-b border-border bg-background flex items-center justify-between px-4 md:px-8 shrink-0 relative z-50 gap-2">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="md:hidden text-text-secondary hover:text-text-primary transition-colors shrink-0"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Greeting — hidden on small screens */}
      <h1 className="text-lg md:text-xl font-bold text-text-primary hidden sm:block truncate">{greeting}</h1>
      
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 justify-end min-w-0">
        {/* Desktop Search Bar */}
        <div className="relative hidden md:flex items-center w-64 lg:w-96 group" ref={searchRef}>
          <Search className="w-4 h-4 text-text-secondary absolute left-3" />
          <input 
            type="text" 
            placeholder="Search transactions or FAQs..." 
            className="w-full bg-surface border border-border rounded-full py-2 pl-9 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-blue transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchDropdown}
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowMobileSearch(v => !v)}
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors shrink-0"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Role Toggle */}
        <div className="flex bg-surface rounded-full p-0.5 sm:p-1 border border-border shrink-0">
          <button
            onClick={() => setRole('Viewer')}
            className={clsx(
              "px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs font-medium rounded-full transition-colors",
              role === 'Viewer' ? "bg-text-secondary text-white dark:bg-[#333333]" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Viewer
          </button>
          <button
            onClick={() => setRole('Admin')}
            className={clsx(
              "px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs font-medium rounded-full transition-colors",
              role === 'Admin' ? "bg-text-secondary text-white dark:bg-[#333333]" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Admin
          </button>
        </div>

        <div className="w-[1px] h-6 bg-border hidden sm:block shrink-0"></div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button onClick={toggleTheme} className="text-text-secondary hover:text-text-primary transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <NavLink to="/notifications" className={({ isActive }) => clsx("transition-colors relative", isActive ? "text-brand-blue" : "text-text-secondary hover:text-text-primary")}>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background translate-x-1/4 -translate-y-1/4"></span>
            )}
          </NavLink>
          
          <NavLink to="/profile" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden group-hover:border-brand-blue transition-colors">
               {user?.avatar ? (
                 <img src={user.avatar} className="object-cover w-full h-full" alt="Avatar" />
               ) : (
                 <User className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
               )}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-brand-blue transition-colors">{user?.name}</p>
              <p className="text-xs text-text-secondary capitalize">{role}</p>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          ref={searchRef}
          className="absolute top-full left-0 right-0 bg-background border-b border-border p-3 shadow-lg z-[60] md:hidden"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions or FAQs..."
              className="w-full bg-surface border border-border rounded-full py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-blue transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          {searchDropdown}
        </div>
      )}
    </header>
  );
}
