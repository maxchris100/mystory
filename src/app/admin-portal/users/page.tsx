'use client';

import { QueryTable } from '../_components/Table';
import adminApiService, { AdminUser } from '../../../../services/admin';

export default function AdminUsersPage() {
  const fetchUsers = async () => {
    return await adminApiService.listUsers();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Users</h1>
      </header>

      <QueryTable
        queryKey={['admin', 'users']}
        queryFn={fetchUsers}
        mapDataToRows={(items: AdminUser[]) =>
          (items ?? []).map((u) => ({
            id: u.id,
            name: u.name ?? '-',
            email: u.email ?? '-',
            role: u.role ?? '-',
            subscription: u.subscription ?? null,
          }))
        }
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          {
            key: 'subscription',
            label: 'Subscription',
            render: (row) => {
              const hasSub = !!row.subscription;
              const status = row.subscription?.status ?? null;
              const isActive = status === 'ACTIVE';
              return (
                <span
                  className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${hasSub
                      ? isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {hasSub
                    ? row.subscription?.planId?.toUpperCase()
                    : 'FREE'}
                </span>
              );
            },
          },
          {
            key: 'activeStart',
            label: 'Active Start',
            render: (row) => {
              const startedAt: string | undefined =
                row.subscription?.startedAt ?? undefined;
              if (!startedAt) return '-';
              try {
                return new Date(startedAt).toLocaleDateString();
              } catch {
                return startedAt;
              }
            },
          },
          {
            key: 'activeUntil',
            label: 'Active Until',
            render: (row) => {
              const expiredAt: string | undefined =
                row.subscription?.expiredAt ?? undefined;
              if (!expiredAt) return '-';
              try {
                return new Date(expiredAt).toLocaleDateString();
              } catch {
                return expiredAt;
              }
            },
          },
        ]}
      />
    </div>
  );
}
