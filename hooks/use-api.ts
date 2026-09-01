"use client";

import { useState, useCallback } from "react";
import type { ApiResponse, ApiError } from "@/types/api.types";

/**
 * Custom Hook: useApi
 * 
 * Generic hook untuk handle API calls dengan:
 * - Loading state
 * - Error handling per-field
 * - Generic type support
 * - Auto parse PostgreSQL errors
 * 
 * Usage:
 * ```tsx
 * const { execute, loading, error } = useApi<User>();
 * 
 * const handleSubmit = async (data) => {
 *   const response = await execute(() => userService.create(data));
 *   if (response.success) {
 *     toast.success("User created!");
 *   }
 * };
 * ```
 */

interface UseApiOptions {
  /**
   * Callback on success
   */
  onSuccess?: <T>(data: T) => void;
  
  /**
   * Callback on error
   */
  onError?: (error: ApiError) => void;
  
  /**
   * Initial loading state
   */
  initialLoading?: boolean;
}

interface UseApiReturn<T> {
  /**
   * Execute API call
   * @param apiCall - Function that returns Promise<ApiResponse<T>>
   * @returns Promise<ApiResponse<T>>
   */
  execute: (apiCall: () => Promise<ApiResponse<T>>) => Promise<ApiResponse<T>>;
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Error object (per-field errors atau general error)
   */
  error: ApiError | null;
  
  /**
   * Response data (success case)
   */
  data: T | null;
  
  /**
   * Reset state (loading, error, data)
   */
  reset: () => void;
}

export function useApi<T = unknown>(options?: UseApiOptions): UseApiReturn<T> {
  const [loading, setLoading] = useState(options?.initialLoading ?? false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const response = await apiCall();

        if (response.success) {
          setData(response.data);
          options?.onSuccess?.(response.data);
        } else {
          setError(response.error);
          options?.onError?.(response.error);
        }

        return response;
      } catch (err) {
        // Handle unexpected errors (network, etc)
        const apiError: ApiError = {
          code: "INTERNAL_ERROR",
          message: err instanceof Error ? err.message : "Terjadi kesalahan sistem",
        };
        
        setError(apiError);
        options?.onError?.(apiError);

        return {
          success: false,
          error: apiError,
        };
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
}

/**
 * Helper: Extract field errors from ApiError
 * 
 * Usage:
 * ```tsx
 * const { error } = useApi();
 * const fieldErrors = getFieldErrors(error);
 * 
 * <Input error={fieldErrors.email} />
 * ```
 */
export function getFieldErrors(error: ApiError | null): Record<string, string> {
  if (!error?.fields) return {};
  
  return Object.entries(error.fields).reduce((acc, [key, messages]) => {
    acc[key] = messages[0]; // Ambil first error message
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Helper: Check if specific field has error
 */
export function hasFieldError(error: ApiError | null, fieldName: string): boolean {
  return !!error?.fields?.[fieldName];
}

/**
 * Helper: Get specific field error message
 */
export function getFieldError(error: ApiError | null, fieldName: string): string | undefined {
  return error?.fields?.[fieldName]?.[0];
}
