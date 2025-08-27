import { Link } from 'react-router-dom';
import { useAuth } from '../../store';

export function CTAButtons() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return (
      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
      >
        Ir al Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        to="/register"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
      >
        Comenzar Gratis
      </Link>
      <Link
        to="/login"
        className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
      >
        Iniciar Sesión
      </Link>
    </>
  );
}

export default CTAButtons;