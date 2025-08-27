import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  iconBgColor = 'bg-blue-100',
  iconTextColor = 'text-blue-600'
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
        <div className={`w-6 h-6 ${iconTextColor}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;