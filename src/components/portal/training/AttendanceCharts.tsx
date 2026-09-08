"use client";

import React from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface AttendanceDistributionItem {
  name: string;
  count: number;
  color: string;
}

interface AttendanceStats {
  totalSessions: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
}

interface AttendanceChartsProps {
  distributionData: AttendanceDistributionItem[];
  stats: AttendanceStats;
  records: any[];
}

export function AttendanceCharts({
  distributionData,
  stats,
  records,
}: AttendanceChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Distribution Pie Chart */}
      <Card className="p-5 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-xs">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
            Attendance Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Overall session attendance distribution
          </CardDescription>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={65}
                paddingAngle={4}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "11px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">
              On Time: <strong>{stats.present}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Late: <strong>{stats.late}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Excused: <strong>{stats.excused}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Absent: <strong>{stats.absent}</strong>
            </span>
          </div>
        </div>
      </Card>

      {/* Bar Chart: Recent Sessions */}
      <Card className="md:col-span-2 p-5 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-xs">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
            Session Attendance Log
          </CardTitle>
          <CardDescription className="text-xs">
            Timeline of your latest recorded training sessions
          </CardDescription>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={records
                .slice(0, 10)
                .reverse()
                .map((r: any) => ({
                  date: formatDate(r.date),
                  score:
                    r.status === "PRESENT"
                      ? 100
                      : r.status === "LATE" || r.status === "EXCUSED"
                      ? 70
                      : 0,
                  status: r.status,
                }))}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                ticks={[0, 50, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md text-xs">
                        <p className="font-bold">{data.date}</p>
                        <p className="text-[11px] text-slate-500">
                          Status:{" "}
                          <strong className="text-primary">
                            {data.status}
                          </strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
          Status is registered upon biometric verification at your training centre.
        </p>
      </Card>
    </div>
  );
}
