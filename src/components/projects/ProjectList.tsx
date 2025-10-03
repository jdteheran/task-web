import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../../store';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { ErrorMessage } from '../common/ErrorMessage';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { PageLayout } from '../layout/PageLayout';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types/project';



export const ProjectList: React.FC = () => {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearError
  } = useProjectStore();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);


  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);



  const handleFormSubmit = async (projectData: CreateProjectRequest | UpdateProjectRequest) => {
    if (editingProject) {
      if (!editingProject.id) {
        console.error('Error: No se puede editar un proyecto sin ID');
        return;
      }
      
      await updateProject(editingProject.id, projectData);
    } else {
      await createProject(projectData as CreateProjectRequest);
    }
    
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <PageLayout title="Mis Proyectos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-600 mt-2">
              Gestiona y organiza todos tus proyectos en un solo lugar
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            + Nuevo Proyecto
          </Button>
        </div>

        {/* Error Message */}
        {error && (
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
        )}

        {/* Project Form Modal */}
        <ProjectForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          editingProject={editingProject}
          loading={loading}
        />

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <EmptyState
            title="No tienes proyectos aún"
            description="Crea tu primer proyecto para comenzar a organizar tus tareas"
            actionLabel="Crear mi primer proyecto"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};