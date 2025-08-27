import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/auth/authService';
import { STORAGE_KEYS } from '../constants/api';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Acción de login
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true });
          
          const response = await authService.login(credentials);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            throw new Error(response.message || 'Error en el login');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Acción de registro
      register: async (userData: RegisterRequest) => {
        try {
          set({ isLoading: true });
          
          const response = await authService.register(userData);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            throw new Error(response.message || 'Error en el registro');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Acción de logout
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      // Acción para establecer loading
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Inicializar autenticación
      initializeAuth: async () => {
        try {
          const state = get();
          const { token } = state;
          
          if (token) {
            // Validar token con el servidor
            const isValid = await authService.validateToken(token);
            
            if (isValid) {
              // Token válido, mantener estado actual
              set({ isLoading: false });
            } else {
              // Token inválido, limpiar estado
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
              });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error al inicializar autenticación:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Hook personalizado para compatibilidad con el código existente
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout
  };
};