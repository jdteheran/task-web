import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { InputField, Button, ErrorMessage } from '../../common';
import { AuthLayout } from '../../layout';

export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

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

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      await register(formData.username, formData.email, formData.password);
      // Redirigir al dashboard después del registro exitoso
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Error al registrarse',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      footerText="¿Ya tienes una cuenta?"
      footerLink={{
        text: "Inicia sesión aquí",
        to: "/login"
      }}
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <ErrorMessage message={errors.general} />
          
          <div className="space-y-4">
            <InputField
              id="username"
              name="username"
              type="text"
              label="Nombre de Usuario"
              autoComplete="username"
              required
              placeholder="Tu nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            
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
              autoComplete="new-password"
              required
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar Contraseña"
              autoComplete="new-password"
              required
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Creando cuenta..."
            className="w-full"
          >
            Crear Cuenta
          </Button>
        </form>
    </AuthLayout>
  );
}

export default Register;