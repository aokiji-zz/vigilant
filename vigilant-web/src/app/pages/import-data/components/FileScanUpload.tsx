// components/FileUpload.tsx

import React, { useState } from 'react'
import './FileUpload.css'
import { Button } from 'react-bootstrap'
import { useUploadFileMutation } from '../../../services/host-files-manager.service'
// interface ImportDataScanDto {
//   setSended: React.Dispatch<React.SetStateAction<boolean>>
//   // sended:true
// }
const ImportDataScan = () => {
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
    files.forEach((file) => formData.append('file', file))

    try {
      await uploadFile({ formData }).unwrap()
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
      <Button onClick={handleUpload} disabled={!files || isLoading}>
        {isLoading ? 'Etracting informations...' : 'Upload File'}
      </Button>
      {error && <p className="error-message">Erro no upload</p>}
      {data && <p className="error-message">Upload bem-sucedido!</p>}
      {data && (
        <div className="file-result-container">
          <h4 style={{ color: 'wheat', marginTop: '1rem' }}>Upload Results</h4>
          <div className="host-info">
            <p className="success-message">Upload bem-sucedido!</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default ImportDataScan
