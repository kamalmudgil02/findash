import { Lightbulb, TrendingDown, Target, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useMemo } from 'react';

export default function FinancialInsights() {
  const { transactions, formatCurrency } = useAppContext();

  const insights = useMemo(() => {
    let highestExpense = { category: 'None', amount: 0 };
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(tx => {
      if (tx.amount < 0) {
        totalExpenses += Math.abs(tx.amount);
        if (Math.abs(tx.amount) > highestExpense.amount) {
          highestExpense = { category: tx.category, amount: Math.abs(tx.amount) };
        }
      } else {
        totalIncome += tx.amount;
      }
    });

    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;
    const observationText = savingsRate >= 20
      ? `Great job saving! You're keeping ${savingsRate}% of your income.`
      : `Caution: Your savings rate is low at ${savingsRate}%. Cut unnecessary expenses!`;

    return { highestExpense, savingsRate, observationText };
  }, [transactions]);

  const cards = [
    {
      icon: TrendingDown,
      iconBg: 'bg-brand-red/10',
      iconColor: 'text-brand-red',
      label: 'Highest Expense',
      value: `${insights.highestExpense.category} (${formatCurrency(insights.highestExpense.amount)})`,
      sub: 'Consider budgeting more for this next month.',
    },
    {
      icon: Target,
      iconBg: 'bg-brand-green/10',
      iconColor: 'text-brand-green',
      label: 'Savings Rate',
      value: `${insights.savingsRate}%`,
      sub: 'Aim for 20% or higher for optimal growth.',
    },
    {
      icon: Info,
      iconBg: 'bg-brand-blue/10',
      iconColor: 'text-brand-blue',
      label: 'Monthly Observation',
      value: insights.savingsRate >= 20 ? 'Target met this month.' : 'Expenses are running high.',
      sub: insights.observationText,
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-brand-yellow">
        <Lightbulb className="w-5 h-5" />
        <h3 className="text-text-primary font-bold">Financial Insights</h3>
      </div>

      {/* Cards fill remaining height equally — no dead space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
        {cards.map((card, i) => (
          <div key={i} className="bg-background rounded-lg p-4 border border-border flex flex-col gap-3 h-full">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h4 className="text-text-secondary text-xs mb-1">{card.label}</h4>
                <p className="text-text-primary font-bold text-sm leading-snug">{card.value}</p>
              </div>
              <p className="text-text-secondary text-xs mt-2 leading-relaxed">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
