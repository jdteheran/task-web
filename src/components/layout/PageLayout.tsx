import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { Button } from '../common';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function PageLayout({ 
  children, 
  title, 
  showHeader = true 
}: PageLayoutProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  {title || 'TaskManager'}
                </h1>
                
                {/* Navigation */}
                {user && (
                  <nav className="flex space-x-6">
                    <Link
                      to="/projects"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/projects') || location.pathname.startsWith('/projects/')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Proyectos
                    </Link>
                    <Link
                      to="/tasks"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/tasks')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Tareas
                    </Link>
                  </nav>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <>
                    <span className="text-sm text-gray-700">
                      Hola, {user.username}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default PageLayout;