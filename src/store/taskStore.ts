import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { taskService } from '../services/task/taskService';
import type { 
  TaskStore, 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskStatus, 
  TaskPriority,
  CreateCommentRequest
} from '../types/task';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentTask: null,
      loading: false,
      error: null,

      fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskService.getTasks();
          set({ tasks, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchTask: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const task = await taskService.getTask(id);
          set({ currentTask: task, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchTasksByProject: async (projectId: string) => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskService.getTasksByProject(projectId);
          set({ tasks, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchTasksByStatus: async (status: TaskStatus) => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskService.getTasksByStatus(status);
          set({ tasks, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchTasksByPriority: async (priority: TaskPriority) => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskService.getTasksByPriority(priority);
          set({ tasks, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchUpcomingTasks: async (days?: number) => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskService.getUpcomingTasks(days);
          set({ tasks, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchOverdueTasks: async () => {
        set({ loading: true, error: null });
        try {
          const tasks = await taskService.getOverdueTasks();
          set({ tasks, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      createTask: async (taskData: CreateTaskRequest) => {
        set({ loading: true, error: null });
        try {
          const newTask = await taskService.createTask(taskData);
          const { tasks } = get() as TaskStore;
          
          set({ 
            tasks: [...tasks, newTask],
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      updateTask: async (id: string, taskData: UpdateTaskRequest) => {
        set({ loading: true, error: null });
        try {
          const updatedTask = await taskService.updateTask(id, taskData);
          const { tasks, currentTask } = get() as TaskStore;
          
          const updatedTasks = tasks.map((task: Task) => 
            task.id === id ? updatedTask : task
          );
          
          set({ 
            tasks: updatedTasks,
            currentTask: currentTask?.id === id ? updatedTask : currentTask,
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      updateTaskStatus: async (id: string, status: TaskStatus) => {
        set({ loading: true, error: null });
        try {
          const updatedTask = await taskService.updateTaskStatus(id, status);
          const { tasks, currentTask } = get() as TaskStore;
          
          const updatedTasks = tasks.map((task: Task) => 
            task.id === id ? updatedTask : task
          );
          
          set({ 
            tasks: updatedTasks,
            currentTask: currentTask?.id === id ? updatedTask : currentTask,
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      deleteTask: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await taskService.deleteTask(id);
          const { tasks, currentTask } = get() as TaskStore;
          
          const filteredTasks = tasks.filter((task: Task) => task.id !== id);
          
          set({ 
            tasks: filteredTasks,
            currentTask: currentTask?.id === id ? null : currentTask,
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      addComment: async (taskId: string, comment: CreateCommentRequest) => {
        set({ loading: true, error: null });
        try {
          await taskService.addComment(taskId, comment);
          // Refrescar la tarea actual para obtener los comentarios actualizados
          const { currentTask } = get() as TaskStore;
          if (currentTask?.id === taskId) {
            const updatedTask = await taskService.getTask(taskId);
            set({ currentTask: updatedTask, loading: false });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchComments: async (taskId: string) => {
        set({ loading: true, error: null });
        try {
          const comments = await taskService.getComments(taskId);
          const { currentTask } = get() as TaskStore;
          
          if (currentTask?.id === taskId) {
            set({ 
              currentTask: { ...currentTask, comments },
              loading: false 
            });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      clearError: () => set({ error: null }),
      
      setCurrentTask: (task: Task | null) => set({ currentTask: task }),
    }),
    {
      name: 'task-store',
      partialize: (state: TaskStore) => ({ 
        tasks: state.tasks,
        currentTask: state.currentTask 
      }),
    }
  )
);