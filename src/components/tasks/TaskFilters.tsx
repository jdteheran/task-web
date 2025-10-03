import React from 'react';
import type { TaskStatus, TaskPriority } from '../../types/task';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../../types/task';

interface TaskFiltersProps {
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  onPriorityFilterChange: (priority: TaskPriority | 'all') => void;
  onClearFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Estado:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | 'all')}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="backlog">{TASK_STATUS_LABELS.backlog}</option>
              <option value="in_progress">{TASK_STATUS_LABELS.in_progress}</option>
              <option value="finished">{TASK_STATUS_LABELS.finished}</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Prioridad:
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriority | 'all')}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="high">{TASK_PRIORITY_LABELS.high}</option>
              <option value="medium">{TASK_PRIORITY_LABELS.medium}</option>
              <option value="low">{TASK_PRIORITY_LABELS.low}</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Filtros activos:</span>
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Estado: {TASK_STATUS_LABELS[statusFilter as TaskStatus]}
                <button
                  onClick={() => onStatusFilterChange('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {priorityFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Prioridad: {TASK_PRIORITY_LABELS[priorityFilter as TaskPriority]}
                <button
                  onClick={() => onPriorityFilterChange('all')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};