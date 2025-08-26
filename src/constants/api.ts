// Constantes para la API

// URL base de la API del backend
export const API_BASE_URL = 'http://localhost:3000';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
} as const;

// Endpoints de tareas
export const TASK_ENDPOINTS = {
  BASE: '/api/tasks',
  BY_ID: (id: string) => `/api/tasks/${id}`,
  BY_STATUS: (status: string) => `/api/tasks/filter/status/${status}`,
  BY_PRIORITY: (priority: string) => `/api/tasks/filter/priority/${priority}`,
  UPCOMING: (days?: number) => `/api/tasks/upcoming${days ? `/${days}` : ''}`,
  OVERDUE: '/api/tasks/overdue',
  COMMENTS: (id: string) => `/api/tasks/${id}/comments`,
  STATUS: (id: string) => `/api/tasks/${id}/status`,
} as const;

// Endpoints de proyectos
export const PROJECT_ENDPOINTS = {
  BASE: '/api/projects',
  BY_ID: (id: string) => `/api/projects/${id}`,
  TASKS: (id: string) => `/api/projects/${id}/tasks`,
  ADD_TASK: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
  REMOVE_TASK: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,
} as const;

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// Claves para localStorage
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;