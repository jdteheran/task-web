import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {title || 'Mi Aplicación'}
                </h1>
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