// components/FileUpload.tsx

import React, { useState } from 'react'
import './FileUpload.css'
import { useUploadFileMutation } from '../services/files.service'
import { Button } from 'react-bootstrap'

const ExtractInformationByUploadPdf = ({ folderName = '' }: { folderName: string }) => {
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
    files.forEach((file) => formData.append('files', file))

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
      <Button onClick={handleUpload} disabled={!files || isLoading}>
        {isLoading ? 'Etracting informations...' : 'Upload File'}
      </Button>
      {error && <p className="error-message">Erro no upload</p>}
      {data && <p className="error-message">Upload bem-sucedido!</p>}
      {data && data.results.length > 0 && (
        <div className="file-result-container">
          <h4 style={{ color: 'wheat', marginTop: '1rem' }}>Upload Results</h4>
          <div className="host-info">
            {data.results.map((result, idx) => (
              <div key={idx} className="host-card">
                <strong>File Name: </strong> {result.original_name}<br />
                <strong>Emails: </strong> {result.emails.length > 0 ? result.emails.join(', ') : 'None'}<br />
                <strong>Brazilian Phones: </strong> {result.tels_br.length > 0 ? result.tels_br.join(', ') : 'None'}<br />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default ExtractInformationByUploadPdf
