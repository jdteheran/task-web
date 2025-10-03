import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { ProjectStats } from '../components/projects/ProjectStats';
import { EmptyState } from '../components/common/EmptyState';
import { TaskList } from '../components/tasks/TaskList';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentProject,
    loading,
    error,
    fetchProject,
    clearError
  } = useProjectStore();

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id, fetchProject]);

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 relative">
          <ErrorMessage message={error} />
          <button
            onClick={clearError}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Button
          onClick={handleBackToProjects}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          ← Volver a Proyectos
        </Button>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Proyecto no encontrado
          </h2>
          <Button
            onClick={handleBackToProjects}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            ← Volver a Proyectos
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue = currentProject.deadline && new Date(currentProject.deadline) < new Date();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            onClick={handleBackToProjects}
            variant="secondary"
            size="sm"
            className="mr-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Proyectos
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentProject.name}
          </h1>
        </div>
        
        <p className="text-gray-600 text-lg mb-6">
          {currentProject.description}
        </p>
      </div>

      {/* Project Stats */}
      <ProjectStats project={currentProject} />

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <TaskList 
          projectId={currentProject.id}
          showFilters={true}
          showCreateButton={true}
        />
      </div>

      {/* Project Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Creado:</span>
            <span className="ml-2 text-gray-900">
              {formatDate(currentProject.createdAt)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Última actualización:</span>
            <span className="ml-2 text-gray-900">
              {formatDate(currentProject.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};