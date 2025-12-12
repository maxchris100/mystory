'use client';

import { ReactNode } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import LoadingCircular from '@/components/LoadingCircular';

export type TableColumn<T = any> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode
};

export type TableRow = {
  id: string;
  [key: string]: any
};

interface TableProps<T extends TableRow> {
  columns: TableColumn<T>[];
  rows: T[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
}

export function Table<T extends TableRow>({
  columns,
  rows,
  isLoading = false,
  error = null,
  emptyMessage = "Tidak ada data"
}: TableProps<T>) {
  if (isLoading) {
    return <div className="flex justify-center p-4"><LoadingCircular /></div>;
  }

  if (error) {
    return <div className="text-sm text-red-600 p-4">{error.message || 'Terjadi kesalahan'}</div>;
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-2 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-3 text-muted-foreground" colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">{col.render ? col.render(row) : String(row[col.key] ?? '-')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface QueryTableProps<TData, TError = Error> extends Omit<TableProps<TableRow>, 'rows' | 'isLoading' | 'error'> {
  queryKey: string[];
  queryFn: () => Promise<TData[]>;
  options?: Omit<UseQueryOptions<TData[], TError, TData[]>, 'queryKey' | 'queryFn'>;
  mapDataToRows: (data: TData[]) => TableRow[];
}

export function QueryTable<TData, TError = Error>({
  columns,
  queryKey,
  queryFn,
  options,
  mapDataToRows,
  emptyMessage
}: QueryTableProps<TData, TError>) {
  const { data, isLoading, error } = useQuery<TData[], TError>({
    queryKey,
    queryFn,
    ...options,
  });

  const rows = data ? mapDataToRows(data) : [];

  return (
    <Table
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      error={error as Error | null}
      emptyMessage={emptyMessage}
    />
  );
}

export default Table;

