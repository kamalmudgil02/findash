import { Target, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function SavingsGoal() {
  const { transactions, formatCurrency } = useAppContext();

  const targetAmount = 15000;

  let totalBalance = 0;
  transactions.forEach(tx => {
    totalBalance += tx.amount;
  });

  const percentage = Math.max(0, Math.min(100, (totalBalance / targetAmount) * 100)).toFixed(1);


  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-text-primary font-bold">Savings Goal</h3>
          <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex flex-col items-center justify-center">
            <Target className="text-brand-purple w-4 h-4" />
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-1">Target: {formatCurrency(targetAmount)}</p>
        <div className="flex items-baseline gap-2 mb-8">
          <h4 className="text-3xl font-bold text-text-primary">{formatCurrency(Math.max(0, totalBalance))}</h4>
          <span className="text-brand-purple font-medium">{percentage}%</span>
        </div>
      </div>

      <div>
        <div className="w-full bg-background rounded-full h-3 mb-4 border border-border">
          <div className="bg-brand-purple h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Trophy className="w-4 h-4 text-brand-yellow" />
          <p>{percentage >= 100 ? "Goal Reached! Amazing job!" : "Keep it up! You're doing great."}</p>
        </div>
      </div>
    </div>
  );
}
