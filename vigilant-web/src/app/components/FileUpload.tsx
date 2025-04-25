import React, { useState } from 'react';
import './FileUpload.css'; // Importe o CSS para estilização
const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Armazena o arquivo selecionado no estado
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log('Uploading file:', file.name);
      // Aqui você pode implementar a lógica para enviar o arquivo ao servidor
    }
  };

  return (
    <div className='file-upload-container'>
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
      <button onClick={handleUpload} disabled={!file}>
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;