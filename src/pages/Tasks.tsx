import React from 'react';
import { TaskList } from '../components/tasks';
import { PageLayout } from '../components/layout/PageLayout';

export const Tasks: React.FC = () => {
  return (
    <PageLayout title="Mis Tareas">
      <TaskList 
        showFilters={true}
        showCreateButton={true}
      />
    </PageLayout>
  );
};