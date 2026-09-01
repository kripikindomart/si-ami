// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: Record<string, string[]>; // Per-field errors
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  data: null;
  message: string;
  errors: Record<string, string[]>;
}

// Database Error Types
export interface PostgresError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
  table?: string;
  column?: string;
  constraint?: string;
}
