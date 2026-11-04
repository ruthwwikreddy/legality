'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, X, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface EmployeeProfile {
  designation: string | null;
  department: string | null;
  barCouncilNumber: string | null;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: string;
  employeeProfile: EmployeeProfile | null;
}

interface AddMemberForm {
  fullName: string;
  email: string;
  password: string;
  designation: string;
  department: string;
  barCouncilNumber: string;
  role: 'EMPLOYEE' | 'ADMIN';
}

const EMPTY_FORM: AddMemberForm = {
  fullName: '',
  email: '',
  password: '',
  designation: '',
  department: '',
  barCouncilNumber: '',
  role: 'EMPLOYEE',
};

export default function AdminTeamPage() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddMemberForm>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchTeam = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/team');
      if (!res.ok) throw new Error('Failed to fetch team');
      const data = await res.json();
      setTeam(data.team ?? []);
    } catch (e) {
      setError('Failed to load team data. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
    setFormSuccess('');
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError('Full name, email, and password are required.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          designation: form.designation.trim() || undefined,
          department: form.department.trim() || undefined,
          barCouncilNumber: form.barCouncilNumber.trim() || undefined,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? 'Failed to create team member.');
        return;
      }
      setFormSuccess(`${form.fullName} has been added to the team.`);
      setForm(EMPTY_FORM);
      await fetchTeam();
    } catch (e) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error(e);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (member: Employee) => {
    setTogglingId(member.id);
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? 'Failed to update status.');
        return;
      }
      setTeam((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isActive: !m.isActive } : m))
      );
    } catch (e) {
      alert('An unexpected error occurred.');
      console.error(e);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            Legal Team &amp; Staff Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {loading ? 'Loading…' : `${team.length} team member${team.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-700">
            <Users className="w-3.5 h-3.5" />
            <span>{team.length} Staff</span>
          </div>
          <button
            onClick={() => {
              setShowForm((v) => !v);
              setFormError('');
              setFormSuccess('');
              setForm(EMPTY_FORM);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition"
          >
            {showForm ? (
              <>
                <X className="w-3.5 h-3.5" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add Team Member
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Member Form */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-bold text-neutral-900">New Team Member</h2>
          </div>
          <form onSubmit={handleAddMember} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField label="Full Name" required>
                <input
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleFormChange}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="form-input"
                />
              </FormField>
              <FormField label="Email Address" required>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="e.g. priya@legality.in"
                  required
                  className="form-input"
                />
              </FormField>
              <FormField label="Password" required>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleFormChange}
                  placeholder="Set initial password"
                  required
                  className="form-input"
                />
              </FormField>
              <FormField label="Designation">
                <input
                  name="designation"
                  type="text"
                  value={form.designation}
                  onChange={handleFormChange}
                  placeholder="e.g. Senior Legal Associate"
                  className="form-input"
                />
              </FormField>
              <FormField label="Department">
                <input
                  name="department"
                  type="text"
                  value={form.department}
                  onChange={handleFormChange}
                  placeholder="e.g. Corporate Law"
                  className="form-input"
                />
              </FormField>
              <FormField label="Bar Council Number">
                <input
                  name="barCouncilNumber"
                  type="text"
                  value={form.barCouncilNumber}
                  onChange={handleFormChange}
                  placeholder="Optional"
                  className="form-input"
                />
              </FormField>
              <FormField label="Role" required>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="form-input"
                >
                  <option value="EMPLOYEE">Employee (Legal Counsel)</option>
                  <option value="ADMIN">Admin (Full Access)</option>
                </select>
              </FormField>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5 text-xs text-rose-700 font-medium">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-xs text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                {formSuccess}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {formLoading ? 'Creating…' : 'Create Team Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading team members…</div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-xs text-rose-700 font-medium">{error}</div>
      ) : team.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900">No team members yet</h3>
          <p className="text-xs text-neutral-500">Add your first team member using the button above.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Designation</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Bar No.</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50/70 transition">
                    <td className="px-5 py-4 font-bold text-neutral-900">{member.fullName}</td>
                    <td className="px-5 py-4 text-neutral-600 font-mono text-[11px]">{member.email}</td>
                    <td className="px-5 py-4">
                      {member.role === 'ADMIN' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-neutral-900 border-neutral-800 text-white">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-neutral-100 border-neutral-300 text-neutral-700">
                          EMPLOYEE
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-700">
                      {member.employeeProfile?.designation ?? <span className="text-neutral-400">—</span>}
                    </td>
                    <td className="px-5 py-4 text-neutral-700">
                      {member.employeeProfile?.department ?? <span className="text-neutral-400">—</span>}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-neutral-500">
                      {member.employeeProfile?.barCouncilNumber ?? <span className="text-neutral-400">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {member.isActive ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-500 text-[11px]">
                      {new Date(member.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggleActive(member)}
                        disabled={togglingId === member.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                          member.isActive
                            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {togglingId === member.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : member.isActive ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {togglingId === member.id
                          ? 'Saving…'
                          : member.isActive
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid rgb(212 212 212);
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: rgb(23 23 23);
          outline: none;
          transition: box-shadow 0.15s;
        }
        .form-input:focus {
          box-shadow: 0 0 0 1px rgb(23 23 23);
        }
        .form-input::placeholder {
          color: rgb(163 163 163);
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
