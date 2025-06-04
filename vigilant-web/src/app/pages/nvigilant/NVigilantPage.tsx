import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useLocation, useNavigate } from 'react-router-dom'
import './NVigilantPage.css'

import logo from '../assets/nvigilant_logo_cropped.png'
import { icons } from '../../common/icons/icons'
import { useScanMutation } from '../../services/scan-queue.service'
import FileUpload from '../../components/FileUpload'
const VigilantPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [fetchScan, { data: scanData, error: scanError, isLoading: scanIsLoading }] = useScanMutation()
  const [form, setForm] = useState({
    ip: (location.state as string) || '',
    folderName: ''
  })


  useEffect(() => {
    if ((scanError as any)?.data?.statusCode === 401) {
      localStorage.removeItem('user')
      navigate('/login')
    }
  }, [scanError, scanData, navigate])




  const handleFetchHosts = () => {
    fetchScan({ target: form.ip })

  }

  const goToList = () => {
    navigate('/list')
  }


  return (
    <div className="container-vigilant">
      <div className="filter">
        <img src={logo} style={{
          height: '2rem',
          marginBottom: '2rem'
        }} />
        <h3 style={{ color: 'wheat' }} className="form-title">Scan scheduler</h3>
        <Form>
          <Form.Group controlId="ipAddress">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="example.com or 192.168.0.1"
              value={form.ip}
              onChange={(e) => setForm({ ip: e.target.value, folderName: '' })} // Atualiza o estado
            />
          </Form.Group>
          <br />
          <Form.Group controlId="folderName">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Folder name"
              value={form.folderName}
              onChange={(e) => setForm({ ip: '', folderName: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <br />
          <FileUpload folderName={form.folderName} />
          <br />
          <div className="filter-buttons" style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button onClick={handleFetchHosts}>
              {scanIsLoading ? 'Scanning...' : <>Scan</>}
            </Button>
            <div>
              <Button onClick={() => goToList()}>
                List {icons.list}
              </Button>
            </div>
          </div>
        </Form>
      </div>
      {scanIsLoading ? (
        <h3>Loading...</h3>
      ) : scanError ? (
        <p className="error-message">
          Error fetching hosts{' '}
          {scanError && 'data' in scanError && (scanError.data as any)?.message || ''}
        </p>
      ) : (
        <p className="error-message">
          {scanData?.message && !scanError ? ('Scan started successfully!') : "Scan doesn't started"}
        </p>
      )}
    </div >
  )
}

export default VigilantPage