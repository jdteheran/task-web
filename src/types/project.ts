export interface Project {
  id: string;
  name: string;
  description: string;
  deadline?: string;
  progress: number;
  taskIds?: string[]; // Array de IDs de tareas (opcional)
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  deadline?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  deadline?: string;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (project: CreateProjectRequest) => Promise<void>;
  updateProject: (id: string, project: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentProject: (project: Project | null) => void;
}