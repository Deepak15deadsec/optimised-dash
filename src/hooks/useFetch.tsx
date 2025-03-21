
import { useQuery, useMutation, useQueryClient, QueryKey } from 'react-query';
import { get, post, put, del } from '@/lib/axios';
import { toast } from 'sonner';
import { ApiResponse, PaginatedResponse } from '@/lib/types';

// Hook for fetching data
export function useFetch<T>(
  queryKey: QueryKey,
  url: string, 
  options = {}
) {
  return useQuery(
    queryKey,
    async () => {
      try {
        return await get<ApiResponse<T>>(url);
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    options
  );
}

// Hook for fetching paginated data
export function usePaginatedFetch<T>(
  queryKey: QueryKey,
  url: string,
  page = 1,
  limit = 10,
  options = {}
) {
  const finalUrl = `${url}?page=${page}&limit=${limit}`;
  
  return useQuery(
    [...queryKey, page, limit],
    async () => {
      try {
        return await get<PaginatedResponse<T>>(finalUrl);
      } catch (error) {
        console.error('Paginated fetch error:', error);
        throw error;
      }
    },
    options
  );
}

// Hook for creating data
export function useCreate<T, D>(url: string, options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (data: D) => {
      try {
        return await post<ApiResponse<T>, D>(url, data);
      } catch (error) {
        console.error('Create error:', error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables, context) => {
        toast.success(data.message || 'Successfully created');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create');
      },
      ...options
    }
  );
}

// Hook for updating data
export function useUpdate<T, D>(url: string, queryKey: QueryKey, options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ id, data }: { id: string; data: D }) => {
      try {
        return await put<ApiResponse<T>, D>(`${url}/${id}`, data);
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(queryKey);
        toast.success(data.message || 'Successfully updated');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update');
      },
      ...options
    }
  );
}

// Hook for deleting data
export function useDelete<T>(url: string, queryKey: QueryKey, options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (id: string) => {
      try {
        return await del<ApiResponse<T>>(`${url}/${id}`);
      } catch (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(queryKey);
        toast.success(data.message || 'Successfully deleted');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update');
      },
      ...options
    }
  );
}
