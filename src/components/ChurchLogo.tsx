import React from 'react';

interface ChurchLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ChurchLogo: React.FC<ChurchLogoProps> = ({ className = "mark", style }) => {
  return (
    <img
      src="images/logo.png"
      alt="The Act of Prayers and Deliverance Ministries International Logo"
      className={className}
      style={{
        objectFit: 'contain',
        borderRadius: '50%',
        ...style
      }}
    />
  );
};
