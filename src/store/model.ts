
import { Action, Computed, Thunk, action, computed, thunk } from 'easy-peasy';
import { User, LoginCredentials, RegisterCredentials, ApiResponse } from '@/lib/types';
import { post } from '@/lib/axios';
import { toast } from 'sonner';

// Auth Model
export interface AuthModel {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: Action<AuthModel, User | null>;
  setToken: Action<AuthModel, string | null>;
  setIsAuthenticated: Action<AuthModel, boolean>;
  setIsLoading: Action<AuthModel, boolean>;
  setError: Action<AuthModel, string | null>;
  
  // Computed
  hasRole: Computed<AuthModel, (role: string) => boolean>;
  
  // Thunks
  login: Thunk<AuthModel, LoginCredentials>;
  register: Thunk<AuthModel, RegisterCredentials>;
  logout: Thunk<AuthModel>;
  restoreAuth: Thunk<AuthModel>;
}

// Theme Model
export interface ThemeModel {
  // State
  theme: 'light' | 'dark';
  
  // Actions
  setTheme: Action<ThemeModel, 'light' | 'dark'>;
  
  // Thunks
  toggleTheme: Thunk<ThemeModel>;
  initTheme: Thunk<ThemeModel>;
}

// Root Store Model
export interface StoreModel {
  auth: AuthModel;
  theme: ThemeModel;
}

// Auth Model Implementation
export const authModel: AuthModel = {
  // State
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  // Actions
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setToken: action((state, payload) => {
    state.token = payload;
    if (payload) {
      localStorage.setItem('token', payload);
    } else {
      localStorage.removeItem('token');
    }
  }),
  setIsAuthenticated: action((state, payload) => {
    state.isAuthenticated = payload;
  }),
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  
  // Computed
  hasRole: computed((state) => (role: string) => {
    return state.user?.role === role;
  }),
  
  // Thunks
  login: thunk(async (actions, credentials, { dispatch }) => {
    try {
      actions.setIsLoading(true);
      actions.setError(null);
      
      // Call login API
      const response = await post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        credentials
      );
      
      const { user, token } = response.data;
      
      // Update auth state
      actions.setUser(user);
      actions.setToken(token);
      actions.setIsAuthenticated(true);
      
      // Show success message
      toast.success('Login successful');
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      actions.setIsLoading(false);
    }
  }),
  
  register: thunk(async (actions, credentials) => {
    try {
      actions.setIsLoading(true);
      actions.setError(null);
      
      // Call register API
      const response = await post<ApiResponse<{ user: User; token: string }>>(
        '/auth/register',
        credentials
      );
      
      const { user, token } = response.data;
      
      // Update auth state
      actions.setUser(user);
      actions.setToken(token);
      actions.setIsAuthenticated(true);
      
      // Show success message
      toast.success('Registration successful');
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      actions.setIsLoading(false);
    }
  }),
  
  logout: thunk(async (actions) => {
    // Clear token and user data
    actions.setToken(null);
    actions.setUser(null);
    actions.setIsAuthenticated(false);
    actions.setError(null);
    
    // Show success message
    toast.success('Logged out successfully');
  }),
  
  restoreAuth: thunk(async (actions) => {
    actions.setIsLoading(true);
    
    const token = localStorage.getItem('token');
    
    if (token) {
      // For this template, we'll just set isAuthenticated to true
      // In a real app, you would verify the token with the server
      actions.setIsAuthenticated(true);
    }
    
    actions.setIsLoading(false);
  })
};

// Theme Model Implementation
export const themeModel: ThemeModel = {
  // State
  theme: 'light',
  
  // Actions
  setTheme: action((state, payload) => {
    state.theme = payload;
    
    // Apply theme to document element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(payload);
    
    // Save theme to localStorage
    localStorage.setItem('theme', payload);
  }),
  
  // Thunks
  toggleTheme: thunk(async (actions, _, { getState }) => {
    const currentTheme = getState().theme;
    actions.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }),
  
  initTheme: thunk(async (actions) => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      actions.setTheme(savedTheme);
    } else {
      // Check for system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      actions.setTheme(prefersDark ? 'dark' : 'light');
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        actions.setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // This would normally clean up the event listener, but in thunks we can't return a cleanup function
    // In a real app, you'd handle this cleanup in a component's useEffect
  })
};
