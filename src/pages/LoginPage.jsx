import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const { login, signup, isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Auto redirect if accidentally landing here while authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const safeEmail = email.trim().toLowerCase();
    const safePw = password.trim();
    
    if (isLoginMode) {
      if (!safeEmail || !safePw) {
        setError('Please fill in both fields.');
        return;
      }
      
      const debugStored = localStorage.getItem(`${safeEmail}_password`);
      const success = login(safeEmail, safePw);
      if (success) {
        navigate('/');
      } else {
        setError(`Invalid credentials. (Debug: Stored password is "${debugStored || 'NULL'}", you provided "${safePw}")`);
      }
    } else {
      if (!name || !safeEmail || !safePw) {
        setError('Please fill in all fields.');
        return;
      }
      if (safePw.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const debugStoredUser = localStorage.getItem(`${safeEmail}_user`);
      const debugStoredPw = localStorage.getItem(`${safeEmail}_password`);
      const success = signup(name, safeEmail, safePw);
      if (success) {
        navigate('/');
      } else {
        setError(`Registration failed. (Debug: Pw stored? [${!!debugStoredPw}], User stored? [${!!debugStoredUser}])`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome to FinDash</h1>
            <p className="text-text-secondary text-sm">
              {isLoginMode ? 'Sign in to your account' : 'Register your local account'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-brand-red/10 border border-brand-red text-brand-red text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-brand-blue transition-colors"
                placeholder="Alex Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-brand-blue transition-colors"
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-brand-blue transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="mt-4 w-full bg-brand-blue hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors">
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text-secondary">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }} 
            className="text-brand-blue font-medium hover:underline focus:outline-none"
          >
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
