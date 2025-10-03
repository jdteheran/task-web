import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '../../types/task';

interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  deadline?: string;
  projectId?: string;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  editingTask?: Task | null;
  loading?: boolean;
  projectId?: string; // Para crear tareas directamente en un proyecto
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  loading = false,
  projectId
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    projectId: projectId || ''
  });

  useEffect(() => {
    if (editingTask) {
      // Convertir la fecha del formato ISO a YYYY-MM-DD para el input date
      let formattedDeadline = '';
      if (editingTask.deadline) {
        const date = new Date(editingTask.deadline);
        if (!isNaN(date.getTime())) {
          formattedDeadline = date.toISOString().split('T')[0];
        }
      }

      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        deadline: formattedDeadline,
        projectId: editingTask.projectId || projectId || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
        projectId: projectId || ''
      });
    }
  }, [editingTask, projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: CreateTaskRequest | UpdateTaskRequest = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      ...(formData.deadline && { deadline: formData.deadline }),
      ...(formData.projectId && { projectId: formData.projectId })
    };

    try {
      await onSubmit(taskData);
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el título de la tarea"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe la tarea"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha límite (opcional)
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Project ID (hidden if editing or if projectId is provided) */}
          {!projectId && (
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                ID del Proyecto (opcional)
              </label>
              <input
                type="text"
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ID del proyecto (opcional)"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              loadingText={editingTask ? 'Actualizando...' : 'Creando...'}
            >
              {editingTask ? 'Actualizar' : 'Crear'} Tarea
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};