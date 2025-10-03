import React from 'react';
import type { Task } from '../../types/task';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    onStatusChange?.(task.id, newStatus);
  };

  // Colores de fondo según el estado
  const getStatusBackgroundColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog':
        return 'bg-gray-50 border-l-gray-400';
      case 'in_progress':
        return 'bg-blue-50 border-l-blue-500';
      case 'finished':
        return 'bg-green-50 border-l-green-500';
      default:
        return 'bg-white border-l-gray-300';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border border-gray-200 border-l-4 hover:shadow-md transition-all duration-200 ${getStatusBackgroundColor(task.status)}`}>
      {/* Layout horizontal */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Contenido principal - lado izquierdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-4">
              {/* Información principal */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {task.description}
                </p>
                
                {/* Badges en línea */}
                <div className="flex items-center space-x-2 mb-2">
                  {/* Status */}
                  {onStatusChange ? (
                    <select
                      value={task.status}
                      onChange={handleStatusChange}
                      className="text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="backlog">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="finished">Finalizado</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  )}

                  {/* Priority */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </span>
                </div>
              </div>

              {/* Información lateral */}
              <div className="flex flex-col items-end space-y-2 text-sm text-gray-500">
                {/* Deadline */}
                {task.deadline && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {formatDate(task.deadline)}
                      {isOverdue && ' (Vencida)'}
                    </span>
                  </div>
                )}

                {/* Comments count */}
                {task.comments && task.comments.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs">
                      {task.comments.length}
                    </span>
                  </div>
                )}

                {/* Created date */}
                <span className="text-xs text-gray-400">
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions - lado derecho */}
          <div className="flex items-center space-x-1 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="Editar tarea"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                title="Eliminar tarea"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};