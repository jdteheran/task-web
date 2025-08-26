import { API_BASE_URL, AUTH_ENDPOINTS, DEFAULT_HEADERS } from '../../constants/api';
import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, User } from '../../types/auth';

class AuthService {
  private baseUrl = API_BASE_URL;

  // Método para hacer peticiones HTTP
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en AuthService:', error);
      throw error;
    }
  }

  // Login de usuario
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Registro de usuario
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Obtener perfil del usuario autenticado
  async getProfile(token: string): Promise<ApiResponse<User>> {
    return this.makeRequest<ApiResponse<User>>(AUTH_ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Validar token
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.getProfile(token);
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;