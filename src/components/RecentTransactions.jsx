import { useState, useMemo } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ArrowUpDown } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';
import { useAppContext } from '../context/AppContext';

export default function RecentTransactions({ role }) {
  const { transactions, deleteTransaction, updateTransaction, categories: ctxCategories, formatCurrency } = useAppContext();
  
  const [filterType, setFilterType] = useState('All Types');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All Categories', ...ctxCategories];
  const types = ['All Types', 'Income', 'Expense'];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handeEdit = (id) => {
     // A simple fallback for editing, since creating a full Edit Modal takes another file.
     const tx = transactions.find(t => t.id === id);
     if(!tx) return;
     const newDesc = prompt("Update description:", tx.description);
     if(newDesc !== null) {
        updateTransaction({ ...tx, description: newDesc });
     }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (filterType !== 'All Types') {
      result = result.filter(t => t.type === filterType);
    }
    if (filterCategory !== 'All Categories') {
      result = result.filter(t => t.category === filterCategory);
    }

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filterType, filterCategory, sortField, sortOrder]);

  return (
    <>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-border">
          <h3 className="text-text-primary font-bold text-base sm:text-lg">Recent Transactions</h3>
        </div>

        <div className="p-3 sm:p-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-surface border border-border text-text-primary text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-brand-blue"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-surface border border-border text-text-primary text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-brand-blue"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {role === 'Admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-6 text-text-secondary font-medium text-sm">Description</th>
                <th className="py-4 px-6 text-text-secondary font-medium text-sm cursor-pointer hover:text-text-primary transition-colors select-none" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-6 text-text-secondary font-medium text-sm">Category</th>
                <th className="py-4 px-6 text-text-secondary font-medium text-sm cursor-pointer hover:text-text-primary transition-colors select-none" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                {role === 'Admin' && (
                  <th className="py-4 px-6 text-text-secondary font-medium text-sm text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-none hover:bg-surface-hover transition-colors">
                  <td className="py-4 px-6 text-text-primary font-medium">{t.description}</td>
                  <td className="py-4 px-6 text-text-secondary text-sm">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-background border border-border text-text-secondary text-xs px-2.5 py-1 rounded-full">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold" style={{ color: t.amount > 0 ? 'var(--color-brand-green)' : 'var(--color-text-primary)' }}>
                    {t.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(t.amount))}
                  </td>
                  {role === 'Admin' && (
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-text-secondary hover:text-text-primary transition-colors" onClick={() => handeEdit(t.id)}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-text-secondary hover:text-brand-red transition-colors" onClick={() => deleteTransaction(t.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={role === 'Admin' ? 5 : 4} className="py-8 text-center text-text-secondary">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
