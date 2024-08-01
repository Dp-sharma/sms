// components/Button.js
import React from 'react';

const Button = ({ bgco, hbgco, textColor, children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: bgco || 'transparent',
        color: textColor || 'black',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        fontSize: '16px',
        borderRadius: '4px',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = hbgco || bgco;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = bgco || 'transparent';
      }}
    type='submit'
    >
      {children}
    </button>
  );
};

export default Button;
