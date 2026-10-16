import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: '30px',
    medium: '50px',
    large: '70px'
  };

  return (
    <div className="spinner-container">
      <div 
        className="loading-spinner"
        style={{ 
          width: sizes[size] || sizes.medium,
          height: sizes[size] || sizes.medium
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;