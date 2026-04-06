import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

const initialTransactions = [
  { id: 1, description: 'Gym Membership', date: '2026-04-30', category: 'Other Expense', amount: -250.00, type: 'Expense' },
  { id: 2, description: 'Uber Rides', date: '2026-04-28', category: 'Transport', amount: -45.00, type: 'Expense' },
  { id: 3, description: 'Local Market', date: '2026-04-25', category: 'Groceries', amount: -90.00, type: 'Expense' },
  { id: 4, description: 'Salary Deposit', date: '2026-04-20', category: 'Income', amount: 5200.00, type: 'Income' },
  { id: 5, description: 'Electricity Bill', date: '2026-04-18', category: 'Utilities', amount: -150.00, type: 'Expense' },
  { id: 6, description: 'Restaurant', date: '2026-04-15', category: 'Dining', amount: -85.00, type: 'Expense' },
];

const defaultSettings = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyReport: true,
  budgetWarnings: true,
  twoFactor: false,
  biometric: false,
  hideBalance: false,
  autoLock: true,
  compactView: false,
  currency: 'USD ($)',
  language: 'English',
};

const defaultCategories = ['Other Expense', 'Transport', 'Groceries', 'Utilities', 'Dining', 'Entertainment', 'Rent/Mortgage', 'Income'];

const seedNotifications = [
  { id: 1, type: 'income', title: 'Salary Received', desc: 'Salary Deposit of $5,200.00 has been credited.', time: new Date(Date.now() - 86400000).toISOString(), read: false },
  { id: 2, type: 'expense', title: 'Expense Alert', desc: 'Gym Membership expense of $250.00 was recorded.', time: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 3, type: 'goal', title: 'Savings Goal Update', desc: 'You have reached 13% of your $15,000 savings goal.', time: new Date(Date.now() - 172800000).toISOString(), read: true },
];

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true');
  
  const [activeAccount, setActiveAccount] = useState(() => {
    // ONE-TIME MIGRATION OF GLOBAL DB -> geetanshmalik337@gmail.com
    // Runs only if there is global legacy data but no isolated account data yet
    if (localStorage.getItem('transactions') && !localStorage.getItem('geetanshmalik337@gmail.com_transactions')) {
       localStorage.setItem('geetanshmalik337@gmail.com_password', '123456');
       ['user', 'transactions', 'appSettings', 'categories', 'notifications', 'userRole', 'theme'].forEach(key => {
          const val = localStorage.getItem(key);
          if (val) localStorage.setItem(`geetanshmalik337@gmail.com_${key}`, val);
          localStorage.removeItem(key); // clear the global ones to prevent confusion later
       });
       // Erase global auth triggers to force them to sign in cleanly to their newly rescued account
       localStorage.removeItem('userPassword');
       localStorage.removeItem('auth');
       return null;
    }
    return localStorage.getItem('activeAccount') || null;
  });

  const getDb = (key, defaultVal) => {
    if (!activeAccount) return defaultVal;
    const v = localStorage.getItem(`${activeAccount}_${key}`);
    return v ? JSON.parse(v) : defaultVal;
  };
  const getDbStr = (key, defaultVal) => {
    if (!activeAccount) return defaultVal;
    return localStorage.getItem(`${activeAccount}_${key}`) || defaultVal;
  };

  const [role, setRole] = useState(() => getDbStr('userRole', 'Viewer'));
  const [user, setUser] = useState(() => getDb('user', {
      name: 'Alex Doe', email: activeAccount || 'alex@example.com', phone: '+1 (555) 000-0000',
      location: 'San Francisco, CA', dob: '1995-06-15', gender: 'Prefer not to say',
      bio: 'Finance enthusiast tracking every dollar.', avatar: null,
  }));
  const [transactions, setTransactions] = useState(() => getDb('transactions', initialTransactions));
  const [isDarkMode, setIsDarkMode] = useState(() => getDbStr('theme', 'dark') === 'dark');
  const [settings, setSettings] = useState(() => getDb('appSettings', defaultSettings));
  const [categories, setCategories] = useState(() => getDb('categories', defaultCategories));
  const [notifications, setNotifications] = useState(() => getDb('notifications', seedNotifications));

  // Sync state explicitly to the activeAccount's isolated local bucket
  useEffect(() => { localStorage.setItem('auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { if (activeAccount) localStorage.setItem('activeAccount', activeAccount); }, [activeAccount]);
  useEffect(() => { if (activeAccount) localStorage.setItem(`${activeAccount}_userRole`, role); }, [role, activeAccount]);
  useEffect(() => { if (activeAccount) localStorage.setItem(`${activeAccount}_user`, JSON.stringify(user)); }, [user, activeAccount]);
  useEffect(() => { if (activeAccount) localStorage.setItem(`${activeAccount}_transactions`, JSON.stringify(transactions)); }, [transactions, activeAccount]);
  useEffect(() => { if (activeAccount) localStorage.setItem(`${activeAccount}_appSettings`, JSON.stringify(settings)); }, [settings, activeAccount]);
  useEffect(() => { if (activeAccount) localStorage.setItem(`${activeAccount}_categories`, JSON.stringify(categories)); }, [categories, activeAccount]);
  useEffect(() => { if (activeAccount) localStorage.setItem(`${activeAccount}_notifications`, JSON.stringify(notifications)); }, [notifications, activeAccount]);

  useEffect(() => {
    if (activeAccount) localStorage.setItem(`${activeAccount}_theme`, isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode, activeAccount]);

  useEffect(() => {
    document.documentElement.classList.toggle('compact', settings.compactView);
  }, [settings.compactView]);

  // Auto-lock: 10min inactivity logout
  useEffect(() => {
    if (!settings.autoLock || !isAuthenticated) return;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         setIsAuthenticated(false);
         localStorage.removeItem('auth');
      }, 10 * 60 * 1000);
    };
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    reset();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
    };
  }, [settings.autoLock, isAuthenticated]);

  const login = (email, password) => {
    if (email && password) {
      const storedPassword = localStorage.getItem(`${email}_password`);
      
      // Enforce strict login comparison mapping against their specific profile database
      if (storedPassword && password === storedPassword) {
        localStorage.setItem('activeAccount', email);
        localStorage.setItem('auth', 'true');
        // A hard refresh reliably flushes React state to reconstruct the tree purely from the swapped activeAccount DB
        window.location.reload(); 
        return true;
      }
    }
    return false;
  };

  const signup = (name, email, password) => {
    if (name && email && password) {
      // Prevent overwriting an existing account, EXCEPT for geetanshmalik337@gmail.com completing their first rescued sign up
      if (localStorage.getItem(`${email}_password`) && localStorage.getItem(`${email}_user`)) {
          return false;
      }
      
      localStorage.setItem(`${email}_password`, password);
      
      const newUser = {
        name,
        email,
        phone: '',
        location: '',
        dob: '',
        gender: '',
        bio: 'New user tracking finances.',
        avatar: null
      };
      
      localStorage.setItem(`${email}_user`, JSON.stringify(newUser));
      localStorage.setItem('activeAccount', email);
      localStorage.setItem('auth', 'true');
      window.location.reload();
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
    localStorage.removeItem('activeAccount');
    window.location.reload();
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const saveSettings = (newSettings) => setSettings(newSettings);

  // Notification helpers
  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ ...notif, id: Date.now(), time: new Date().toISOString(), read: false }, ...prev]);
  }, []);
  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  const deleteAllNotifications = useCallback(() => setNotifications([]), []);

  // Transaction CRUD — adding a tx auto-generates a notification
  const addTransaction = (transaction) => {
    const tx = { ...transaction, id: Date.now() };
    setTransactions(prev => [tx, ...prev]);
    const isIncome = tx.amount > 0;
    
    if (settings.pushNotifications) {
      addNotification({
        type: isIncome ? 'income' : 'expense',
        title: isIncome ? 'Income Recorded' : 'Expense Recorded',
        desc: `${tx.description} — ${isIncome ? '+' : '-'}$${Math.abs(tx.amount).toFixed(2)} in ${tx.category}.`,
      });
    }

    if (settings.budgetWarnings && !isIncome) {
      const totalBal = transactions.reduce((sum, t) => sum + t.amount, 0) + tx.amount;
      if (totalBal < 500) {
         addNotification({
           type: 'alert',
           title: 'Budget Warning',
           desc: `Your balance dropped to $${totalBal.toFixed(2)}. Be careful of your spending!`,
         });
      }
    }
  };

  const updateTransaction = (updatedTx) => setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(tx => tx.id !== id));

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) setCategories(prev => [...prev, trimmed]);
  };
  const removeCategory = (name) => {
    if (!defaultCategories.includes(name)) setCategories(prev => prev.filter(c => c !== name));
  };

  const formatCurrency = (value) => {
    const currencyMap = {
      'USD ($)': { currency: 'USD', locale: 'en-US' },
      'EUR (€)': { currency: 'EUR', locale: 'de-DE' },
      'GBP (£)': { currency: 'GBP', locale: 'en-GB' },
      'INR (₹)': { currency: 'INR', locale: 'en-IN' },
      'JPY (¥)': { currency: 'JPY', locale: 'ja-JP' },
    };
    const { currency, locale } = currencyMap[settings.currency] || currencyMap['USD ($)'];
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      isAuthenticated, login, logout, signup,
      user, setUser,
      role, setRole,
      transactions, addTransaction, updateTransaction, deleteTransaction,
      isDarkMode, toggleTheme,
      settings, saveSettings,
      categories, addCategory, removeCategory,
      formatCurrency,
      notifications, addNotification, markAsRead, markAllRead, deleteAllNotifications, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
