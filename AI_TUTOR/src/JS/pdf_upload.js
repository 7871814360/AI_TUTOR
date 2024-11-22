import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ email }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileId, setFileId] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('fileName', fileName);
    formData.append('email', email); // Append the email to the form data

    try {
      const response = await axios.post('http://localhost:4001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message); // Assuming your backend sends a message
      setFileId(response.data.fileId);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed.");
    }
  };

  const handleNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!fileId) {
      alert("Please upload a file before saving.");
      return;
    }
    // Here you can implement the save functionality, like sending the file name to your backend
    alert(`File ID: ${fileId}, File Name: ${fileName}`);
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Upload PDF</button>
      </form>

      <form onSubmit={handleUpload}>
        <h4>Name your PDF</h4>
        <input 
          type="text" 
          value={fileName} 
          onChange={handleNameChange} 
          placeholder="Enter a name for your PDF" 
        />
        <button type="submit">Save</button>
      </form>
    </>
  );
};

export default UploadForm;