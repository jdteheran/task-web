import { useAuth } from '../contexts/AuthContext';
import { FeatureCard } from '../components/common';
import { HeroSection, CTAButtons } from '../components/home';

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center min-h-screen py-12">
          <HeroSection
            title="Gestor de Proyectos"
            subtitle="y Tareas"
            description="Organiza tus proyectos, gestiona tus tareas y aumenta tu productividad con nuestra plataforma completa de gestión."
          >
            <CTAButtons isAuthenticated={isAuthenticated} />
          </HeroSection>
          
          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              title="Gestión de Tareas"
              description="Organiza tus tareas por prioridad y estado. Mantén el control total de tu trabajo."
              iconBgColor="bg-blue-100"
              iconTextColor="text-blue-600"
            />
            
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              title="Proyectos"
              description="Agrupa tus tareas en proyectos y visualiza el progreso de cada uno."
              iconBgColor="bg-green-100"
              iconTextColor="text-green-600"
            />
            
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Seguimiento"
              description="Monitorea el progreso y mantente al día con fechas límite y comentarios."
              iconBgColor="bg-purple-100"
              iconTextColor="text-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;