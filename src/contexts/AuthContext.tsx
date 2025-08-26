import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthState, User } from '../types/auth';
import { authService } from '../services/auth/authService';
import { STORAGE_KEYS } from '../constants/api';

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Tipos de acciones
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función de login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, token } 
        });
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // Función de registro
  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authService.register({ username, email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, token } 
        });
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // Función de logout
  const logout = (): void => {
    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    dispatch({ type: 'LOGOUT' });
  };

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userStr) {
          // Validar token con el servidor
          const isValid = await authService.validateToken(token);
          
          if (isValid) {
            const user = JSON.parse(userStr);
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user, token } 
            });
          } else {
            // Token inválido, limpiar localStorage
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            dispatch({ type: 'LOGIN_FAILURE' });
          }
        } else {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

export default AuthContext;