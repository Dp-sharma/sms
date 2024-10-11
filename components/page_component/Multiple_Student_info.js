'use client'
// components/UploadForm.js
import React ,{ useState } from 'react';

const Multiple_Student_info = ()=> {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/Student/StudentDataEntry/MultipleEntry', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      setMessage(result.message || 'File uploaded successfully');
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
}
export default Multiple_Student_info;