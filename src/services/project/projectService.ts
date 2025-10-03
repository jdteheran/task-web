import { API_BASE_URL, STORAGE_KEYS } from '../../constants/api';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  ProjectResponse,
} from '../../types/project';

class ProjectService {
  private getAuthHeaders(): HeadersInit {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      const token = authStorage ? JSON.parse(authStorage).state?.token : null;
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    } catch (error) {
      console.error('Error parsing auth storage:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ProjectsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener proyectos');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ProjectResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener proyecto');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ProjectResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al crear proyecto');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ProjectResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al actualizar proyecto');
      }

      return data.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al eliminar proyecto');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();