import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../common/ProgressBar';
import type { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      onDelete?.(project.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  const isOverdue = project.deadline && new Date(project.deadline) < new Date();

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {project.name}
        </h3>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Editar proyecto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="text-red-600 hover:text-red-800 p-1"
              title="Eliminar proyecto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Progress Bar */}
      <ProgressBar 
        progress={project.progress} 
        showPercentage={true}
        className="mb-4"
      />

      {/* Footer */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">
            {project.taskIds?.length || 0} tarea{(project.taskIds?.length || 0) !== 1 ? 's' : ''}
          </span>
        </div>
        
        {project.deadline && (
          <div className={`flex items-center space-x-1 ${
            isOverdue ? 'text-red-600' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={isOverdue ? 'font-medium' : ''}>
              {formatDate(project.deadline)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};