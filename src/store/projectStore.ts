import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projectService } from '../services/project/projectService';
import type { ProjectStore, Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project';

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      loading: false,
      error: null,

      fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
          const projects = await projectService.getProjects();
          set({ projects, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchProject: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const project = await projectService.getProject(id);
          set({ currentProject: project, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      createProject: async (projectData: CreateProjectRequest) => {
        set({ loading: true, error: null });
        try {
          const newProject = await projectService.createProject(projectData);
          const { projects } = get() as ProjectStore;
          set({ 
            projects: [...projects, newProject], 
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      updateProject: async (id: string, projectData: UpdateProjectRequest) => {
        set({ loading: true, error: null });
        try {
          const updatedProject = await projectService.updateProject(id, projectData);
          const { projects, currentProject } = get() as ProjectStore;
          
          const updatedProjects = projects.map((project: Project) => 
            project.id === id ? updatedProject : project
          );
          
          set({ 
            projects: updatedProjects,
            currentProject: currentProject?.id === id ? updatedProject : currentProject,
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      deleteProject: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await projectService.deleteProject(id);
          const { projects, currentProject } = get() as ProjectStore;
          
          const filteredProjects = projects.filter((project: Project) => project.id !== id);
          
          set({ 
            projects: filteredProjects,
            currentProject: currentProject?.id === id ? null : currentProject,
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      clearError: () => set({ error: null }),
      
      setCurrentProject: (project: Project | null) => set({ currentProject: project }),
    }),
    {
      name: 'project-store',
      partialize: (state: ProjectStore) => ({ 
        projects: state.projects,
        currentProject: state.currentProject 
      }),
    }
  )
);