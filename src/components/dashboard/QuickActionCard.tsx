
interface QuickActionCardProps {
  title: string;
  description: string;
  actionText: string;
  colorScheme: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  onClick?: () => void;
}

export function QuickActionCard({ 
  title, 
  description, 
  actionText, 
  colorScheme,
  onClick 
}: QuickActionCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleText: 'text-blue-900',
      descText: 'text-blue-700',
      actionText: 'text-blue-600 hover:text-blue-800'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleText: 'text-green-900',
      descText: 'text-green-700',
      actionText: 'text-green-600 hover:text-green-800'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      titleText: 'text-purple-900',
      descText: 'text-purple-700',
      actionText: 'text-purple-600 hover:text-purple-800'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titleText: 'text-red-900',
      descText: 'text-red-700',
      actionText: 'text-red-600 hover:text-red-800'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      titleText: 'text-yellow-900',
      descText: 'text-yellow-700',
      actionText: 'text-yellow-600 hover:text-yellow-800'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <h4 className={`font-semibold ${colors.titleText} mb-2`}>{title}</h4>
      <p className={`${colors.descText} text-sm`}>{description}</p>
      <button 
        className={`mt-2 ${colors.actionText} text-sm font-medium transition-colors`}
        onClick={onClick}
      >
        {actionText}
      </button>
    </div>
  );
}

export default QuickActionCard;