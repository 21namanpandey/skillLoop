import React from 'react';
import { FaTrophy, FaStar, FaAward, FaCrown, FaSeedling } from 'react-icons/fa';

const ReputationBadge = ({ level, points, showDetails = false, size = "md" }) => {
  const getLevelConfig = (level) => {
    const configs = {
      Novice: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <FaSeedling />, 
        minPoints: 0,
        gradient: 'from-gray-100 to-gray-200'
      },
      Intermediate: { 
        color: 'bg-green-100 text-green-800', 
        icon: <FaStar />, 
        minPoints: 50,
        gradient: 'from-green-100 to-green-200'
      },
      Expert: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <FaAward />, 
        minPoints: 200,
        gradient: 'from-blue-100 to-blue-200'
      },
      Master: { 
        color: 'bg-purple-100 text-purple-800', 
        icon: <FaTrophy />, 
        minPoints: 500,
        gradient: 'from-purple-100 to-purple-200'
      },
      Legend: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <FaCrown />, 
        minPoints: 1000,
        gradient: 'from-yellow-100 to-yellow-200'
      }
    };
    return configs[level] || configs.Novice;
  };

  const getNextLevel = (currentLevel) => {
    const levels = [
      { level: "Novice", minPoints: 0 },
      { level: "Intermediate", minPoints: 50 },
      { level: "Expert", minPoints: 200 },
      { level: "Master", minPoints: 500 },
      { level: "Legend", minPoints: 1000 }
    ];
    
    const currentIndex = levels.findIndex(l => l.level === currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const config = getLevelConfig(level);
  const nextLevel = getNextLevel(level);
  const progress = nextLevel ? 
    Math.min(100, ((points - config.minPoints) / (nextLevel.minPoints - config.minPoints)) * 100) : 
    100;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <div className="inline-flex flex-col items-center">
      <div className={`inline-flex items-center rounded-full ${config.color} ${sizeClasses[size]}`}>
        <span className="mr-2">{config.icon}</span>
        <span className="font-medium">{level}</span>
        <span className="ml-2 text-xs opacity-80">({points} pts)</span>
      </div>
      
      {showDetails && nextLevel && (
        <div className="mt-2 w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Level Progress</span>
            <span className="font-medium">{nextLevel.minPoints - points} to {nextLevel.level}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-linear-to-r ${config.gradient} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{points} points</span>
            <span>{nextLevel.minPoints} points</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReputationBadge;