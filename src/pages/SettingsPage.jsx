import { useAppContext } from '../context/AppContext';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import {
  Moon, Sun, Bell, Shield, Globe, Wallet,
  Eye, EyeOff, Lock, Smartphone, CreditCard,
  RefreshCw, Download, Trash2, ChevronRight, CheckCircle, XCircle, Tag, Plus, X
} from 'lucide-react';

function Toggle({ enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={clsx(
        'w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0',
        enabled ? 'bg-brand-blue' : 'bg-border'
      )}
    >
      <div className={clsx(
        'w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm',
        enabled ? 'right-1' : 'left-1'
      )} />
    </div>
  );
}

function SettingRow({ icon: Icon, iconColor = 'text-text-secondary', title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={clsx('shrink-0 w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center', iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-text-primary font-medium text-sm">{title}</p>
          {description && <p className="text-text-secondary text-xs mt-0.5 leading-snug">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4 text-brand-blue">{title}</h3>
      <div className="divide-y divide-border/50">{children}</div>
    </div>
  );
}

const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'JPY (¥)'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi'];

export default function SettingsPage() {
  const { isDarkMode, toggleTheme, settings, saveSettings, transactions, categories, addCategory, removeCategory } = useAppContext();

  const DEFAULT_CATEGORIES = ['Other Expense', 'Transport', 'Groceries', 'Utilities', 'Dining', 'Entertainment', 'Rent/Mortgage', 'Income'];
  const [newCat, setNewCat] = useState('');
  const [catError, setCatError] = useState('');

  // Toast notification system
  const [toast, setToast] = useState(null); // { msg, type: 'info'|'success'|'warn' }
  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  const comingSoon = (feature) => showToast(`${feature} — coming soon!`, 'info');

  // Change Password inline
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwData, setPwData] = useState({ current: '', next: '', confirm: '' });
  const handleChangePw = (e) => {
    e.preventDefault();
    const activeAccount = localStorage.getItem('activeAccount');
    const currentDbPassword = localStorage.getItem(`${activeAccount}_password`);

    // If a password is set in DB, it must match current input
    if (currentDbPassword && pwData.current !== currentDbPassword) { 
      showToast('Incorrect current password', 'warn'); 
      return; 
    }
    
    if (pwData.next !== pwData.confirm) { showToast('Passwords do not match', 'warn'); return; }
    if (pwData.next.length < 6) { showToast('Password must be at least 6 characters', 'warn'); return; }

    localStorage.setItem(`${activeAccount}_password`, pwData.next); // Save new localized password
    showToast('Password updated successfully!', 'success');
    setShowPwForm(false);
    setPwData({ current: '', next: '', confirm: '' });
  };

  // Draft = unsaved local state. Only committed to context on Save.
  const [draft, setDraft] = useState({ ...settings });
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [discarded, setDiscarded] = useState(false);

  // Keep draft in sync if settings change externally (e.g. first load)
  useEffect(() => {
    setDraft({ ...settings });
    setIsDirty(false);
  }, [settings]);

  const update = (key) => (value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };
  const toggle = (key) => () => {
    setDraft(prev => ({ ...prev, [key]: !prev[key] }));
    setIsDirty(true);
  };

  const handleSave = () => {
    saveSettings(draft);
    setIsDirty(false);
    showToast('Settings saved successfully!', 'success');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDiscard = () => {
    setDraft({ ...settings });
    setIsDirty(false);
    setDiscarded(true);
    setTimeout(() => setDiscarded(false), 2000);
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will permanently delete all transactions and notifications.')) {
      const activeAccount = localStorage.getItem('activeAccount');
      localStorage.removeItem(`${activeAccount}_transactions`);
      localStorage.removeItem(`${activeAccount}_notifications`);
      window.location.reload();
    }
  };

  const selectClass = "bg-background border border-border rounded-lg px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-brand-blue transition-colors cursor-pointer";

  return (
    <div className="flex flex-col gap-6 max-w-3xl pb-12">
      {/* Toast */}
      {toast && (
        <div
          style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999 }}
          className={clsx(
            'flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border',
            toast.type === 'success' && 'bg-brand-green/10 border-brand-green/40 text-brand-green',
            toast.type === 'warn'    && 'bg-brand-yellow/10 border-brand-yellow/40 text-brand-yellow',
            toast.type === 'info'   && 'bg-surface border-border text-text-primary',
          )}
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
          {toast.type === 'warn'    && <XCircle className="w-4 h-4" />}
          {toast.type === 'info'    && <span>ℹ️</span>}
          {toast.msg}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Settings</h2>
          <p className="text-text-secondary text-sm mt-1">Changes only apply after clicking Save.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 text-brand-green text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Settings saved!
            </div>
          )}
          {discarded && (
            <div className="flex items-center gap-1.5 text-text-secondary text-sm">
              <XCircle className="w-4 h-4" /> Discarded
            </div>
          )}
          {isDirty && (
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface text-sm font-medium transition-colors"
            >
              Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg',
              isDirty
                ? 'bg-brand-blue hover:bg-blue-600 text-white'
                : 'bg-border text-text-secondary cursor-not-allowed'
            )}
          >
            Save Changes
          </button>
        </div>
      </div>

      {isDirty && (
        <div className="bg-brand-yellow/10 border border-brand-yellow/40 rounded-lg px-4 py-2.5 text-brand-yellow text-sm flex items-center gap-2">
          <span className="font-medium">⚠ Unsaved changes</span> — click Save to apply them throughout the app.
        </div>
      )}

      {/* Appearance */}
      <SectionCard title="Appearance">
        <SettingRow
          icon={isDarkMode ? Moon : Sun}
          iconColor="text-brand-yellow"
          title="Dark Mode"
          description="Switch between dark and light theme. Applied immediately."
          action={<Toggle enabled={isDarkMode} onToggle={toggleTheme} />}
        />
        <SettingRow
          icon={Eye}
          iconColor="text-brand-blue"
          title="Compact View"
          description="Reduce spacing for a denser layout. (Coming soon)"
          action={<Toggle enabled={draft.compactView} onToggle={() => { toggle('compactView')(); comingSoon('Compact View'); }} />}
        />
        <SettingRow
          icon={EyeOff}
          iconColor="text-brand-purple"
          title="Hide Balance"
          description="Blur sensitive balance amounts on the dashboard."
          action={<Toggle enabled={draft.hideBalance} onToggle={toggle('hideBalance')} />}
        />
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications">
        <SettingRow icon={Bell} iconColor="text-brand-blue" title="Email Notifications"
          description="Receive account updates and alerts via email. (Coming soon)"
          action={<Toggle enabled={draft.emailNotifications} onToggle={() => { toggle('emailNotifications')(); comingSoon('Email Notifications'); }} />} />
        <SettingRow icon={Smartphone} iconColor="text-brand-green" title="Push Notifications"
          description="Receive alerts securely on your device."
          action={<Toggle enabled={draft.pushNotifications} onToggle={toggle('pushNotifications')} />} />
        <SettingRow icon={RefreshCw} iconColor="text-brand-yellow" title="Weekly Summary Report"
          description="Get a financial summary every Monday. (Coming soon)"
          action={<Toggle enabled={draft.weeklyReport} onToggle={() => { toggle('weeklyReport')(); comingSoon('Weekly Summary Report'); }} />} />
        <SettingRow icon={Wallet} iconColor="text-brand-purple" title="Budget Warnings"
          description="Alert when balance drops below threshold ($500)."
          action={<Toggle enabled={draft.budgetWarnings} onToggle={toggle('budgetWarnings')} />} />
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security & Privacy">
        <SettingRow icon={Shield} iconColor="text-brand-green" title="Two-Factor Authentication"
          description="Add an extra layer of security on login. (Coming soon)"
          action={<Toggle enabled={draft.twoFactor} onToggle={() => { toggle('twoFactor')(); comingSoon('Two-Factor Authentication'); }} />} />
        <SettingRow icon={Lock} iconColor="text-brand-blue" title="Auto-Lock Session"
          description="Lock dashboard after 15 minutes of inactivity. Saved setting is applied immediately."
          action={<Toggle enabled={draft.autoLock} onToggle={toggle('autoLock')} />} />
        <SettingRow icon={Smartphone} iconColor="text-brand-purple" title="Biometric Login"
          description="Use fingerprint or Face ID to sign in. (Coming soon)"
          action={<Toggle enabled={draft.biometric} onToggle={() => { toggle('biometric')(); comingSoon('Biometric Login'); }} />} />
        <div className="py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-text-secondary">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm">Change Password</p>
                <p className="text-text-secondary text-xs mt-0.5">Update your account password.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPwForm(v => !v)}
              className="flex items-center gap-1 text-brand-blue text-sm font-medium hover:underline shrink-0"
            >
              {showPwForm ? 'Cancel' : 'Update'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {showPwForm && (
            <form onSubmit={handleChangePw} className="mt-3 bg-background border border-border rounded-lg p-4 flex flex-col gap-3">
              {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([k, label]) => (
                <div key={k}>
                  <label className="block text-xs text-text-secondary mb-1">{label}</label>
                  <input
                    type="password" required
                    value={pwData[k]}
                    onChange={e => setPwData(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-brand-blue"
                  />
                </div>
              ))}
              <button type="submit" className="self-start px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                Save Password
              </button>
            </form>
          )}
        </div>
      </SectionCard>

      {/* Regional */}
      <SectionCard title="Regional & Display">
        <SettingRow icon={Wallet} iconColor="text-brand-green" title="Currency"
          description="Set display currency used across the dashboard and charts. Save to apply."
          action={
            <select value={draft.currency} onChange={e => update('currency')(e.target.value)} className={selectClass}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          } />
        <SettingRow icon={Globe} iconColor="text-brand-blue" title="Language"
          description="App language. (International language support coming soon)"
          action={
            <select
              value={draft.language}
              onChange={e => { update('language')(e.target.value); comingSoon('Language switching'); }}
              className={selectClass}
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          } />
      </SectionCard>

      {/* Categories */}
      <SectionCard title="Transaction Categories">
        <div className="py-3 flex flex-col gap-3">
          <p className="text-text-secondary text-xs">Add or remove categories. Default categories cannot be deleted.</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isDefault = DEFAULT_CATEGORIES.includes(cat);
              return (
                <div key={cat} className="flex items-center gap-1 bg-background border border-border rounded-full px-3 py-1 text-sm">
                  <Tag className="w-3 h-3 text-text-secondary" />
                  <span className="text-text-primary">{cat}</span>
                  {!isDefault && (
                    <button
                      onClick={() => removeCategory(cat)}
                      className="ml-1 text-text-secondary hover:text-brand-red transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New category name..."
              value={newCat}
              onChange={e => { setNewCat(e.target.value); setCatError(''); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const t = newCat.trim();
                  if (!t) { setCatError('Name cannot be empty'); return; }
                  if (categories.includes(t)) { setCatError('Already exists'); return; }
                  addCategory(t); setNewCat('');
                }
              }}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-brand-blue"
            />
            <button
              onClick={() => {
                const t = newCat.trim();
                if (!t) { setCatError('Name cannot be empty'); return; }
                if (categories.includes(t)) { setCatError('Already exists'); return; }
                addCategory(t); setNewCat('');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {catError && <p className="text-brand-red text-xs">{catError}</p>}
        </div>
      </SectionCard>

      {/* Data */}
      <SectionCard title="Data & Storage">
        <SettingRow icon={Download} iconColor="text-brand-blue" title="Export Transactions"
          description="Download your full transaction history as CSV."
          action={
            <button
              onClick={() => {
                const headers = 'Date,Description,Category,Type,Amount\n';
                const rows = transactions.map(tx =>
                  `${tx.date},"${tx.description}",${tx.category},${tx.type},${tx.amount}`
                ).join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'transactions.csv'; a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1 text-brand-blue text-sm font-medium hover:underline"
            >
              Export <ChevronRight className="w-4 h-4" />
            </button>
          } />
        <SettingRow icon={Trash2} iconColor="text-brand-red" title="Clear All Data"
          description="Delete all transactions and reset the dashboard permanently."
          action={
            <button onClick={handleClearData} className="text-brand-red text-sm font-medium hover:underline flex items-center gap-1">
              Clear <ChevronRight className="w-4 h-4" />
            </button>
          } />
      </SectionCard>
    </div>
  );
}
