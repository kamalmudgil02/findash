import { X, Plus, Tag } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction, categories, addCategory } = useAppContext();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: categories[0] || 'Other Expense',
    type: 'Expense',
    date: new Date().toISOString().split('T')[0],
  });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [catError, setCatError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = formData.type === 'Expense'
      ? -Math.abs(parseFloat(formData.amount))
      : Math.abs(parseFloat(formData.amount));
    addTransaction({ ...formData, amount: finalAmount });
    setFormData({
      description: '',
      amount: '',
      category: categories[0] || 'Other Expense',
      type: 'Expense',
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) { setCatError('Category name cannot be empty.'); return; }
    if (categories.includes(trimmed)) { setCatError('Category already exists.'); return; }
    addCategory(trimmed);
    setFormData(prev => ({ ...prev, category: trimmed }));
    setNewCategory('');
    setCatError('');
    setShowAddCategory(false);
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-brand-blue transition-colors text-sm";
  const labelClass = "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-xl font-bold text-text-primary">Add Transaction</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              required
              type="text"
              placeholder="e.g. Monthly Groceries"
              className={inputClass}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputClass + ' pl-7'}
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                required
                type="date"
                className={inputClass}
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Expense</option>
                <option>Income</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add New Category */}
          {!showAddCategory ? (
            <button
              type="button"
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 text-brand-blue text-sm font-medium hover:underline self-start"
            >
              <Plus className="w-4 h-4" />
              Add new category
            </button>
          ) : (
            <div className="bg-background border border-border rounded-lg p-3 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" /> New Category
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Category name"
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-brand-blue"
                  value={newCategory}
                  onChange={e => { setNewCategory(e.target.value); setCatError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCategory(false); setNewCategory(''); setCatError(''); }}
                  className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
              {catError && <p className="text-brand-red text-xs">{catError}</p>}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Confirm Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
