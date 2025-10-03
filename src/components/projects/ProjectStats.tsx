import React, { useEffect, useState } from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { useTaskStore } from '../../store';
import type { Project } from '../../types/project';

interface ProjectStatsProps {
  project: Project;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ project }) => {
  const { tasks, fetchTasksByProject } = useTaskStore();
  const [calculatedProgress, setCalculatedProgress] = useState(project.progress);
  const [taskCount, setTaskCount] = useState(project.taskIds?.length || 0);

  useEffect(() => {
    // Obtener las tareas del proyecto para calcular el progreso real
    if (project.id) {
      fetchTasksByProject(project.id);
    }
  }, [project.id, fetchTasksByProject]);

  useEffect(() => {
    // Calcular progreso basado en tareas completadas
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'finished');
    
    const progress = projectTasks.length > 0 
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : 0;
    
    setCalculatedProgress(progress);
    setTaskCount(projectTasks.length);
  }, [tasks, project.id]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-green-700';
    if (progress >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const isOverdue = project.deadline && new Date(project.deadline) < new Date();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Progress Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Progreso</h3>
          <span className={`text-2xl font-bold ${getProgressTextColor(calculatedProgress)}`}>
            {calculatedProgress}%
          </span>
        </div>
        <ProgressBar progress={calculatedProgress} size="lg" />
      </div>

      {/* Tasks Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tareas</h3>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-2xl font-bold text-blue-600">
              {taskCount}
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          {taskCount === 0 ? 'Sin tareas' : 
           taskCount === 1 ? '1 tarea total' : 
           `${taskCount} tareas totales`}
        </p>
      </div>

      {/* Deadline Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Fecha Límite</h3>
          <div className={`flex items-center space-x-2 ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        {project.deadline ? (
          <div>
            <p className={`font-medium ${
              isOverdue ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatDate(project.deadline)}
            </p>
            {isOverdue && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                ¡Vencido!
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Sin fecha límite</p>
        )}
      </div>
    </div>
  );
};