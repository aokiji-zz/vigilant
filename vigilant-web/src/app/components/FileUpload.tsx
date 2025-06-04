// components/FileUpload.tsx

import React, { useState } from 'react'
import './FileUpload.css'
import { useUploadFileMutation } from '../services/files.service'

const FileUpload = ({ folderName = '' }: { folderName: string }) => {
  const [files, setFiles] = useState<File[]>([])
  const [uploadFile, { isLoading, error, data }] = useUploadFileMutation()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files))
    }
  }
  const handleUpload = async () => {
    if (files.length === 0) return

    const formData = new FormData()
    files.forEach((file) => formData.append('files', file)) // ✅ nome do campo = files

    try {
      await uploadFile({ formData, folderName }).unwrap()
    } catch (err) {
      console.error('Erro ao enviar o arquivo:', err)
    }
  }

  return (
    <div className="file-upload-container">
      <input type="file" onChange={handleFileChange} multiple />
      <ul>
        {files.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
      <button onClick={handleUpload} disabled={!files || isLoading}>
        {isLoading ? 'Enviando...' : 'Upload File'}
      </button>
      {error && <p className="error-message">Erro no upload</p>}
      {data && <p className="success-message">Upload bem-sucedido!</p>}
    </div>
  )
}

export default FileUpload
