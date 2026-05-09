/**
 * Custom Hook: useAsync
 * Handles async operations with loading, error, and data states
 * Auto-fallback to mock data if service fails (for testing)
 */

import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOptions<T> {
  fallbackData?: T;
  onError?: (error: any) => void;
  onSuccess?: (data: T) => void;
}

/**
 * Hook để call async functions (API calls, repositories)
 * @param asyncFunction - Hàm async để gọi (ví dụ: tuitionRepository.getAllTuitions)
 * @param fallbackData - Dữ liệu fallback nếu error (mock data)
 * @param options - Options (onError callback, onSuccess callback, etc)
 * 
 * @example
 * const { data, loading, error } = useAsync(
 *   () => tuitionRepository.getAllTuitions(),
 *   mockTuitionData
 * );
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  fallbackData?: T,
  options?: UseAsyncOptions<T>
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(fallbackData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err: any) {
      const errorMessage = err?.message || 'Có lỗi xảy ra';
      console.warn(`Error in async operation (using fallback):`, err);
      setError(errorMessage);
      
      // Fallback to mock data nếu có
      if (fallbackData) {
        setData(fallbackData);
        console.info('Using fallback data...');
      }
      
      options?.onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, fallbackData, options]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error };
}

export default useAsync;
