import { useAuth } from '../contexts/AuthContext';
import { PageLayout } from '../components/layout';
import { UserInfoCard, QuickActionCard } from '../components/dashboard';

export function Dashboard() {
  const { user } = useAuth();

  const handleProjectsClick = () => {
    console.log('Navegando a proyectos...');
  };

  const handleTasksClick = () => {
    console.log('Navegando a tareas...');
  };

  const handleProfileClick = () => {
    console.log('Navegando a perfil...');
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout title="Dashboard">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a tu Dashboard!
          </h2>
          <p className="text-gray-600 mb-6">
            Esta es una página privada que solo pueden ver los usuarios autenticados.
          </p>
          
          <UserInfoCard user={user} />
          
          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              title="Proyectos"
              description="Gestiona tus proyectos"
              actionText="Ver Proyectos →"
              colorScheme="blue"
              onClick={handleProjectsClick}
            />
            
            <QuickActionCard
              title="Tareas"
              description="Administra tus tareas"
              actionText="Ver Tareas →"
              colorScheme="green"
              onClick={handleTasksClick}
            />
            
            <QuickActionCard
              title="Perfil"
              description="Edita tu perfil"
              actionText="Ver Perfil →"
              colorScheme="purple"
              onClick={handleProfileClick}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Dashboard;