'use client';

import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Building,
} from 'lucide-react';

export default function ClientCompliancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/compliance');
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const toggleTask = async (recordId: string, taskId: string, currentVal: boolean) => {
    try {
      // Optimistic update
      setRecords((prev) =>
        prev.map((rec) => {
          if (rec.id !== recordId) return rec;
          return {
            ...rec,
            tasks: rec.tasks.map((t: any) =>
              t.id === taskId ? { ...t, isCompleted: !currentVal } : t
            ),
          };
        })
      );

      await fetch(`/api/compliance/${recordId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentVal }),
      });

      fetchRecords();
    } catch (e) {
      console.error(e);
      fetchRecords();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-950">
          Statutory Compliance & Governance Ledger
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Track regulatory filing obligations, compliance checklists, and statutory deadlines
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading compliance ledger...
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <ClipboardCheck className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No active compliance records</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Your legal team will assign corporate secretarial, tax, and DPDP compliance schedules to this ledger.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((rec) => {
            const completedCount = rec.tasks.filter((t: any) => t.isCompleted).length;
            const totalTasks = rec.tasks.length;
            const pct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
            const daysLeft = Math.ceil(
              (new Date(rec.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={rec.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-700">
                        {rec.trackingNumber}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {rec.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          rec.status === 'COMPLIED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-950">{rec.title}</h3>

                    <div className="text-xs text-neutral-500 flex items-center gap-2 pt-0.5">
                      <Building className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Authority: {rec.authority}</span>
                    </div>
                  </div>

                  {/* Deadline pill */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs space-y-0.5 shrink-0 text-left sm:text-right">
                    <div className="flex items-center gap-1.5 text-neutral-500 sm:justify-end">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Statutory Due Date</span>
                    </div>
                    <div className="font-bold text-neutral-900">
                      {new Date(rec.deadline).toLocaleDateString()}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        daysLeft < 7 ? 'text-rose-600' : 'text-neutral-600'
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Due today'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Task Checklist Completion</span>
                    <span className="font-semibold text-neutral-900">
                      {completedCount} of {totalTasks} Completed ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-900 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Task Checklist Items */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Compliance Action Items
                  </h4>

                  <div className="space-y-2">
                    {rec.tasks.map((task: any) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(rec.id, task.id, task.isCompleted)}
                        className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                          task.isCompleted
                            ? 'bg-neutral-50/70 border-neutral-200 text-neutral-500'
                            : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => {}} // handled by parent div click
                          className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                        />
                        <div className="flex-1 text-xs">
                          <p className={`font-semibold ${task.isCompleted ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {rec.notes && (
                  <div className="p-3 bg-neutral-50 rounded text-xs text-neutral-600 italic">
                    Note: {rec.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

