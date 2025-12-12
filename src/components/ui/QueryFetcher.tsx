'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import LoadingCircular from '@/components/LoadingCircular';
import { ReactNode } from 'react';

interface QueryFetcherProps<TData, TError> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>;
  loadingComponent?: ReactNode;
  errorComponent?: (error: TError) => ReactNode;
  children: (data: TData) => ReactNode;
}

export function QueryFetcher<TData, TError = Error>({
  queryKey,
  queryFn,
  options,
  loadingComponent = <LoadingCircular />,
  errorComponent = (error) => <div className="text-sm text-red-600">{(error as any)?.message || 'Terjadi kesalahan'}</div>,
  children,
}: QueryFetcherProps<TData, TError>) {
  const { data, isLoading, error } = useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">{loadingComponent}</div>;
  }

  if (error) {
    return errorComponent(error);
  }

  return <>{children(data as TData)}</>;
}