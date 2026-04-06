import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useMemo, useState, useRef, useCallback } from 'react';

const CATEGORY_COLORS = {
  'Rent/Mortgage': '#3B82F6',
  'Groceries': '#10B981',
  'Dining': '#F59E0B',
  'Other Expense': '#EF4444',
  'Utilities': '#8B5CF6',
  'Transport': '#EC4899',
  'Entertainment': '#64748B',
};

export default function ExpenseCategoryChart() {
  const { transactions, formatCurrency } = useAppContext();
  const containerRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [slideFrom, setSlideFrom] = useState({ x: 0, y: 0 });
  const [animKey, setAnimKey] = useState(0);

  const data = useMemo(() => {
    const byCategory = {};
    transactions.forEach(tx => {
      if (tx.amount < 0) {
        byCategory[tx.category] = (byCategory[tx.category] || 0) + Math.abs(tx.amount);
      }
    });
    return Object.keys(byCategory)
      .map(cat => ({ name: cat, value: byCategory[cat], color: CATEGORY_COLORS[cat] || '#A3A3A3' }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };
    if (hovered) setTooltipPos({ x, y });
  }, [hovered]);

  const handleSegmentEnter = useCallback((segData, index) => {
    const { x, y } = mousePosRef.current;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const mag = Math.sqrt(dx * dx + dy * dy) || 1;
      // 220px travel so the slide is long and clearly visible
      setSlideFrom({ x: (dx / mag) * 220, y: (dy / mag) * 220 });
    }
    setTooltipPos({ x, y });
    setHovered({ name: segData.name, value: segData.value, index });
    setAnimKey(k => k + 1);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-6" style={{ height: '100%', minHeight: 280, display: 'flex', flexDirection: 'column' }}>
      {/* keyframe uses CSS custom props per element — works in all modern browsers */}
      <style>{`
        @keyframes segTooltipIn {
          from { opacity: 0; transform: translate(var(--sfx), var(--sfy)); }
          to   { opacity: 1; transform: translate(0px, 0px); }
        }
      `}</style>

      <h3 className="text-text-primary font-bold mb-4">Expenses by Category</h3>

      {data.length > 0 ? (
        <>
          <div
            ref={containerRef}
            className="flex-1 min-h-[200px] w-full relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={handleSegmentEnter}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Custom directional tooltip */}
            {hovered && (
              <div
                key={animKey}
                style={{
                  position: 'absolute',
                  left: tooltipPos.x,
                  top: tooltipPos.y,
                  pointerEvents: 'none',
                  zIndex: 50,
                  '--sfx': `${slideFrom.x}px`,
                  '--sfy': `${slideFrom.y}px`,
                  animation: 'segTooltipIn 0.38s cubic-bezier(0.22,1,0.36,1) forwards',
                }}
              >
                {/* inner box: always displayed above cursor, centered */}
                <div
                  className="bg-surface border border-border rounded-lg shadow-2xl px-3 py-2 whitespace-nowrap"
                  style={{ transform: 'translate(-50%, calc(-100% - 14px))' }}
                >
                  <p className="text-text-primary font-bold text-sm">{hovered.name}</p>
                  <p className="text-text-secondary text-xs">{formatCurrency(hovered.value)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 w-full flex items-center justify-center text-text-secondary text-sm">
          No expenses recorded yet.
        </div>
      )}
    </div>
  );
}
