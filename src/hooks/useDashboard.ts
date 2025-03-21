import { useState, useEffect, useCallback } from 'react';
import { get, post, put, del } from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/lib/types';
import { toast } from 'sonner';

// Generic data fetching hook with pagination, sorting, and filtering
export function useDataFetching<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDirection', sortDirection);
      }
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      // Make API call
      const response = await get<PaginatedResponse<T>>(`${endpoint}?${queryParams.toString()}`);
      
      setData(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, pagination.page, pagination.limit, sortBy, sortDirection, filters]);

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  return {
    data,
    loading,
    error,
    pagination,
    sortBy,
    sortDirection,
    filters,
    refetch: fetchData,
    handlePageChange,
    handleLimitChange,
    handleSort,
    handleFilterChange,
    handleFilterReset
  };
}

// CRUD operations hook
export function useCrud<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data listing is handled by useDataFetching
  
  const getById = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await get<ApiResponse<T>>(`${endpoint}/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error('Failed to fetch item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  const create = useCallback(async (data: CreateDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await post<ApiResponse<T>>(endpoint, data);
      toast.success('Item created successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error('Failed to create item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  const update = useCallback(async (id: string | number, data: UpdateDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await put<ApiResponse<T>>(`${endpoint}/${id}`, data);
      toast.success('Item updated successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error('Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  const remove = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      await del<ApiResponse<void>>(`${endpoint}/${id}`);
      toast.success('Item deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error('Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  return {
    loading,
    error,
    getById,
    create,
    update,
    remove
  };
}

// Export an analytics data hook for dashboards
export function useAnalytics(endpoint: string = '/analytics') {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('startDate', dateRange.start);
      queryParams.append('endDate', dateRange.end);
      
      const response = await get<ApiResponse<any>>(`${endpoint}?${queryParams.toString()}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching analytics');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleDateRangeChange = (newRange: { start: string; end: string }) => {
    setDateRange(newRange);
  };

  return {
    data,
    loading,
    error,
    dateRange,
    handleDateRangeChange,
    refetch: fetchAnalytics
  };
} 