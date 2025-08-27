import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  description,
  children
}: HeroSectionProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        {title}
        {subtitle && (
          <span className="block text-blue-600">{subtitle}</span>
        )}
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      
      {children && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {children}
        </div>
      )}
    </div>
  );
}

export default HeroSection;