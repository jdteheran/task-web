// Tipos para tareas basados en la API del backend

export type TaskStatus = 'backlog' | 'in_progress' | 'finished';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  deadline?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority?: TaskPriority;
  projectId?: string;
  deadline?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  projectId?: string;
  deadline?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface CreateCommentRequest {
  content: string;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: TaskComment[];
}

export interface TaskStore {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  fetchTasksByStatus: (status: TaskStatus) => Promise<void>;
  fetchTasksByPriority: (priority: TaskPriority) => Promise<void>;
  fetchUpcomingTasks: (days?: number) => Promise<void>;
  fetchOverdueTasks: () => Promise<void>;
  createTask: (task: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, task: UpdateTaskRequest) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, comment: CreateCommentRequest) => Promise<void>;
  fetchComments: (taskId: string) => Promise<void>;
  clearError: () => void;
  setCurrentTask: (task: Task | null) => void;
}

// Utilidades para tareas
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Pendiente',
  in_progress: 'En Progreso',
  finished: 'Finalizado'
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  finished: 'bg-green-100 text-green-800'
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};