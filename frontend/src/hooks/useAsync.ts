import { useState, useCallback } from 'react';
import type { AsyncState, ServiceError } from '../types/api';

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: 'idle',
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState((prev: AsyncState<T>) => ({ ...prev, loading: 'loading', error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: 'success', error: null });
      return data;
    } catch (error) {
      const serviceError: ServiceError = {
        message: error instanceof Error ? error.message : 'An error occurred',
        status: 500,
      };
      setState((prev: AsyncState<T>) => ({ ...prev, loading: 'error', error: serviceError }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: 'idle',
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useAsyncWithData<T>(initialData: T) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: 'idle',
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState((prev: AsyncState<T>) => ({ ...prev, loading: 'loading', error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: 'success', error: null });
      return data;
    } catch (error) {
      const serviceError: ServiceError = {
        message: error instanceof Error ? error.message : 'An error occurred',
        status: 500,
      };
      setState((prev: AsyncState<T>) => ({ ...prev, loading: 'error', error: serviceError }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: 'idle',
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}
