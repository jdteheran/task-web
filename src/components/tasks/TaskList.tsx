import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../../store';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { ErrorMessage } from '../common/ErrorMessage';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority } from '../../types/task';

interface TaskListProps {
  projectId?: string; // Si se proporciona, solo muestra tareas de ese proyecto
  showFilters?: boolean;
  showCreateButton?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  projectId, 
  showFilters = true, 
  showCreateButton = true 
}) => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    fetchTasksByProject,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    clearError
  } = useTaskStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  useEffect(() => {
    if (projectId) {
      fetchTasksByProject(projectId);
    } else {
      fetchTasks();
    }
  }, [projectId, fetchTasks, fetchTasksByProject]);

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const handleFormSubmit = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
    if (editingTask) {
      // Validar que el ID existe antes de actualizar
      if (!editingTask.id) {
        console.error('Error: editingTask.id is undefined');
        return;
      }
      await updateTask(editingTask.id, taskData as UpdateTaskRequest);
    } else {
      // Si estamos en el contexto de un proyecto, agregar el projectId
      const taskWithProject = projectId ? { ...taskData, projectId } : taskData;
      await createTask(taskWithProject as CreateTaskRequest);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {projectId ? 'Tareas del Proyecto' : 'Mis Tareas'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''} 
            {statusFilter !== 'all' || priorityFilter !== 'all' ? ' (filtradas)' : ''}
          </p>
        </div>
        
        {showCreateButton && (
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Tarea
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <TaskFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingTask={editingTask}
        loading={loading}
        projectId={projectId}
      />

      {/* Tasks Grid */}
      {loading && tasks.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          title={
            statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'No hay tareas que coincidan con los filtros'
              : projectId 
                ? 'No hay tareas en este proyecto'
                : 'No tienes tareas aún'
          }
          description={
            statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Intenta ajustar los filtros para ver más tareas'
              : projectId
                ? 'Comienza agregando tareas para organizar el trabajo de tu proyecto'
                : 'Crea tu primera tarea para comenzar a organizar tu trabajo'
          }
          actionLabel={showCreateButton ? 'Crear tarea' : undefined}
          onAction={showCreateButton ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};