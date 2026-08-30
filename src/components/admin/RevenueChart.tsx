"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface RevenueChartPoint {
  label: string;
  value: number;
}

export function RevenueChart({ data }: { data: RevenueChartPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
          <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--hairline)", fontSize: 12 }}
            labelStyle={{ color: "var(--text-primary)" }}
          />
          <Bar dataKey="value" fill="var(--gold)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
