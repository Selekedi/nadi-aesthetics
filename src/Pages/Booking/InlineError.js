import React, { useState } from 'react';

const InlineError = ({ message, onDismiss }) => {
  if (!message) return null;

  const handleClose = () => {
    if (onDismiss) onDismiss(); // Optional callback for the parent
  };

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#fee2e2', // Light red
        border: '1px solid #ef4444', // Red border
        borderRadius: '6px',
        color: '#b91c1c', // Dark red text
        margin: '10px 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>⚠️</span>
        <span>{message}</span>
      </div>
      
      <button
        onClick={handleClose}
        aria-label="Dismiss error"
        style={{
          background: 'none',
          border: 'none',
          color: '#b91c1c',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '0 4px'
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default InlineError;
