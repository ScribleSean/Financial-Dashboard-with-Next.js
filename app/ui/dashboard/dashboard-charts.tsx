'use client';

import type { CashFlowPoint, ExpenseSlice } from '@/app/lib/demo-queries';
import type { Revenue } from '@/app/lib/definitions';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'];

export function RevenueAreaClient({ data }: { data: Revenue[] }) {
  return (
    <div className="h-[320px] min-h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(value) => [
              `$${Number(value ?? 0).toLocaleString()}`,
              'Revenue',
            ]}
            contentStyle={{ borderRadius: 8 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#revFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpensePieClient({ data }: { data: ExpenseSlice[] }) {
  return (
    <div className="h-[300px] min-h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={String(i)} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${Number(value ?? 0).toLocaleString()}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashFlowClient({ data }: { data: CashFlowPoint[] }) {
  return (
    <div className="h-[300px] min-h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(value) => `$${Number(value ?? 0).toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="inflow" name="Cash in" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="outflow" name="Cash out" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsComboClient({ data }: { data: Revenue[] }) {
  const chartData = data.map((r) => ({
    month: r.month,
    revenue: r.revenue,
    margin: Math.round(r.revenue * 0.34),
  }));
  return (
    <div className="h-[360px] min-h-[300px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(value) => `$${Number(value ?? 0).toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="margin" name="Est. margin" stroke="#a855f7" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
