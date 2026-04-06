import RecentTransactions from '../components/RecentTransactions';

export default function TransactionsPage({ role }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-7xl mx-auto pb-8 sm:pb-12">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">All Transactions</h2>
        <p className="text-text-secondary text-sm">View, filter, and manage your complete financial history.</p>
      </div>

      <RecentTransactions role={role} />
    </div>
  );
}
