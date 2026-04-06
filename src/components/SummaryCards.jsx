import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppContext } from '../context/AppContext';

export default function SummaryCards() {
  const { transactions, formatCurrency, settings } = useAppContext();

  let totalIncome = 0;
  let totalExpenses = 0;
  transactions.forEach(tx => {
    if (tx.amount > 0) totalIncome += tx.amount;
    if (tx.amount < 0) totalExpenses += Math.abs(tx.amount);
  });
  const totalBalance = totalIncome - totalExpenses;

  const cards = [
    {
      title: 'Total Balance',
      amount: settings?.hideBalance ? '***' : formatCurrency(totalBalance),
      change: '+2.5%',
      isPositive: true,
      icon: Wallet,
      iconBg: 'bg-brand-blue/10',
      iconColor: 'text-brand-blue'
    },
    {
      title: 'Total Income',
      amount: formatCurrency(totalIncome),
      change: '+12.4%',
      isPositive: true,
      icon: ArrowUpRight,
      iconBg: 'bg-brand-green/10',
      iconColor: 'text-brand-green'
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(totalExpenses),
      change: '-1.2%',
      isPositive: false,
      icon: ArrowDownRight,
      iconBg: 'bg-brand-red/10',
      iconColor: 'text-brand-red'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <h3 className="text-text-secondary text-sm font-medium">{card.title}</h3>
            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", card.iconBg)}>
              <card.icon className={clsx("w-5 h-5", card.iconColor)} />
            </div>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-text-primary mb-2">{card.amount}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className={clsx("font-medium", card.isPositive ? "text-brand-green" : "text-brand-red")}>
                {card.change}
              </span>
              <span className="text-text-secondary">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
