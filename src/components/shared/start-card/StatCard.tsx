import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'primary'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'secondary': return 'bg-gray-100 text-gray-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'danger': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${getVariantClasses()}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center">
          {change >= 0 ? (
            <TrendingUp className="text-green-500 mr-2" size={16} />
          ) : (
            <TrendingDown className="text-red-500 mr-2" size={16} />
          )}
          <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;