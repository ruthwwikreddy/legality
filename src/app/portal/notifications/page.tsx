'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  FileSignature,
  FileText,
  Upload,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default function ClientNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Updates on service requests, signature requirements, and compliance deadlines
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">Inbox is empty</h3>
          <p className="text-xs text-neutral-500">
            You will be alerted when new documents are uploaded or agreements require your attention.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 shadow-sm overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between gap-4 transition ${
                n.isRead ? 'bg-white' : 'bg-neutral-50/80 font-medium'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-neutral-900 shrink-0" />}
                  <span className="font-bold text-xs text-neutral-900">{n.title}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-4">
                  {n.message}
                </p>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-100 hover:bg-neutral-900 hover:text-white text-xs font-semibold text-neutral-800 transition"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

