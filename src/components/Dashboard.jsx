import SummaryCards from './SummaryCards';
import BalanceHistoryChart from './BalanceHistoryChart';
import SavingsGoal from './SavingsGoal';
import ExpenseCategoryChart from './ExpenseCategoryChart';
import FinancialInsights from './FinancialInsights';
import RecentTransactions from './RecentTransactions';

export default function Dashboard({ role }) {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard Overview</h2>
        <p className="text-text-secondary text-sm">Welcome back! Here's what's happening with your finances today.</p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <BalanceHistoryChart />
        </div>
        <div className="lg:col-span-1 h-full">
          <SavingsGoal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 h-full">
          <ExpenseCategoryChart />
        </div>
        <div className="lg:col-span-2 h-full">
          <FinancialInsights />
        </div>
      </div>

      <RecentTransactions role={role} />
    </div>
  );
}
