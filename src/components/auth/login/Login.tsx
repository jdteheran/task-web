import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { InputField, Button, ErrorMessage } from '../../common';
import { AuthLayout } from '../../layout';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta desde donde vino el usuario
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      // Redirigir a la ruta original o al dashboard
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Error al iniciar sesión',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      footerText="¿No tienes una cuenta?"
      footerLink={{
        text: "Regístrate aquí",
        to: "/register"
      }}
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <ErrorMessage message={errors.general} />
          
          <div className="space-y-4">
            <InputField
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              required
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            
            <InputField
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              autoComplete="current-password"
              required
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Iniciando sesión..."
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </form>
    </AuthLayout>
  );
}

export default Login;