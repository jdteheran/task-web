import { API_BASE_URL, TASK_ENDPOINTS, DEFAULT_HEADERS } from '../../constants/api';
import type { 
  Task, 
  TasksResponse, 
  TaskResponse, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  UpdateTaskStatusRequest,
  CreateCommentRequest,
  CommentsResponse,
  TaskStatus,
  TaskPriority
} from '../../types/task';

class TaskService {
  private getAuthHeaders(): HeadersInit {
    // Obtener el token del store de Zustand persistido
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;
    
    if (authStorage) {
      try {
        const parsedStorage = JSON.parse(authStorage);
        token = parsedStorage.state?.token;
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
    
    return {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error en la respuesta del servidor');
    }

    return data;
  }

  // Obtener todas las tareas del usuario
  async getTasks(): Promise<Task[]> {
    const response = await this.makeRequest<TasksResponse>(TASK_ENDPOINTS.BASE);
    return response.data;
  }

  // Obtener una tarea por ID
  async getTask(id: string): Promise<Task> {
    const response = await this.makeRequest<TaskResponse>(TASK_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  // Obtener tareas por estado
  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const response = await this.makeRequest<TasksResponse>(TASK_ENDPOINTS.BY_STATUS(status));
    return response.data;
  }

  // Obtener tareas por prioridad
  async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
    const response = await this.makeRequest<TasksResponse>(TASK_ENDPOINTS.BY_PRIORITY(priority));
    return response.data;
  }

  // Obtener tareas próximas a vencer
  async getUpcomingTasks(days?: number): Promise<Task[]> {
    const response = await this.makeRequest<TasksResponse>(TASK_ENDPOINTS.UPCOMING(days));
    return response.data;
  }

  // Obtener tareas vencidas
  async getOverdueTasks(): Promise<Task[]> {
    const response = await this.makeRequest<TasksResponse>(TASK_ENDPOINTS.OVERDUE);
    return response.data;
  }

  // Crear una nueva tarea
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await this.makeRequest<TaskResponse>(TASK_ENDPOINTS.BASE, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    return response.data;
  }

  // Actualizar una tarea
  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await this.makeRequest<TaskResponse>(TASK_ENDPOINTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
    return response.data;
  }

  // Actualizar el estado de una tarea
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const statusData: UpdateTaskStatusRequest = { status };
    const response = await this.makeRequest<TaskResponse>(TASK_ENDPOINTS.STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    });
    return response.data;
  }

  // Eliminar una tarea
  async deleteTask(id: string): Promise<void> {
    await this.makeRequest(TASK_ENDPOINTS.BY_ID(id), {
      method: 'DELETE'
    });
  }

  // Añadir un comentario a una tarea
  async addComment(taskId: string, commentData: CreateCommentRequest): Promise<void> {
    await this.makeRequest(TASK_ENDPOINTS.COMMENTS(taskId), {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Obtener comentarios de una tarea
  async getComments(taskId: string): Promise<Task['comments']> {
    const response = await this.makeRequest<CommentsResponse>(TASK_ENDPOINTS.COMMENTS(taskId));
    return response.data;
  }

  // Obtener tareas de un proyecto específico
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const allTasks = await this.getTasks();
    return allTasks.filter(task => task.projectId === projectId);
  }
}

export const taskService = new TaskService();