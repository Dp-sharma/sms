'use client';
import React, { useState } from 'react';

const MultipleUserRegister = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/user/CreateMultipleUser', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      setMessage(result.msg || 'File uploaded successfully');
    } catch (error) {
      setMessage('Failed to upload file');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default MultipleUserRegister;
