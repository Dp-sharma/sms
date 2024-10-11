'use client';
import React, { useState } from 'react';

const MultipleAttendance = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/QuickPresence/Attendance/Multipledata', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(result.msg);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Upload Attendance Data</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default MultipleAttendance;
