import BalanceHistoryChart from '../components/BalanceHistoryChart';
import ExpenseCategoryChart from '../components/ExpenseCategoryChart';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-7xl mx-auto pb-8 sm:pb-12">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">Analytics</h2>
        <p className="text-text-secondary text-sm">Deep dive into your financial metrics and trends over time.</p>
      </div>

      {/* Explicit height so ResponsiveContainer can measure it */}
      <div className="h-[300px] sm:h-[380px]">
        <BalanceHistoryChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] sm:h-[380px]">
          <ExpenseCategoryChart />
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center h-[300px] sm:h-[380px]">
          <h3 className="text-text-primary font-bold mb-2">More Insights Coming Soon</h3>
          <p className="text-text-secondary text-sm max-w-sm">We are working on bringing more advanced reporting tools to your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
