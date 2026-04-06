import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useMemo, useRef } from 'react';

const CustomTooltip = ({ active, payload, label, coordinate, formatCurrency }) => {
  const prevLabelRef = useRef(null);
  const prevXRef = useRef(0);
  const sfxRef = useRef(-180);

  // If entering a new data point, calculate movement direction
  if (active && coordinate && label !== prevLabelRef.current) {
    if (coordinate.x > prevXRef.current) {
      sfxRef.current = -220; // Mouse moved right: slide in from left to right
    } else if (coordinate.x < prevXRef.current) {
      sfxRef.current = 220;  // Mouse moved left: slide in from right to left
    }
    prevXRef.current = coordinate.x;
    prevLabelRef.current = label;
  }

  if (active && payload && payload.length && coordinate) {
    return (
      <div
        key={`${label}`}
        style={{
          '--sfx': `${sfxRef.current}px`,
          animation: 'lineTooltipIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
        className="pointer-events-none"
      >
        <div
          className="bg-surface border border-border rounded-lg shadow-2xl px-3 py-2 whitespace-nowrap -translate-x-1/2 -translate-y-full mb-3"
        >
          <p className="text-text-secondary text-xs mb-0.5">{label}</p>
          <p className="text-text-primary font-bold text-base">{formatCurrency(payload[0].value)}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function BalanceHistoryChart() {
  const { transactions, formatCurrency } = useAppContext();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let bal = 0;
    const map = new Map();
    sorted.forEach(tx => {
      const label = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      bal += tx.amount;
      map.set(label, bal);
    });
    return Array.from(map, ([name, balance]) => ({ name, balance }));
  }, [transactions]);

  return (
    <div
      className="bg-surface border border-border rounded-xl p-4 sm:p-6 relative w-full h-full flex flex-col min-h-[280px] sm:min-h-[340px]"
    >
      <style>{`
        @keyframes lineTooltipIn {
          from { opacity: 0; transform: translate(var(--sfx), 0px); }
          to   { opacity: 1; transform: translate(0px, 0px); }
        }
      `}</style>

      <h3 className="text-text-primary font-bold mb-6">Balance History</h3>

      {data.length > 0 ? (
        <div className="flex-1 w-full min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              />

              {/* Native Tooltip wraps our custom content automatically exactly where the user hovers */}
              <Tooltip
                content={<CustomTooltip formatCurrency={formatCurrency} />}
                isAnimationActive={false}
                allowEscapeViewBox={{ x: true, y: true }}
                cursor={{ stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5, strokeDasharray: '5 4' }}
              />

              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3B82F6', stroke: 'var(--color-surface)', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#3B82F6', stroke: 'var(--color-surface)', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 w-full flex items-center justify-center text-text-secondary text-sm">
          Insufficient data to render chart.
        </div>
      )}
    </div>
  );
}
