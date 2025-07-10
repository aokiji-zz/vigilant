import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useLocation, useNavigate } from 'react-router-dom'
import '../vigilant-list/VigilantListPage.css'
import logo from '../assets/nvigilant_logo_cropped.png'
import ImportDataScan from './components/FileScanUpload'
const ImportDataScanPage = () => {
  const navigate = useNavigate()
  const [sended, setSended] = useState<boolean>(false)

  return (
    <div className="container-vigilant">
      <div className="filter">
        <img src={logo} style={{
          height: '2rem',
          marginBottom: '2rem'
        }} />
        <Form>
          <h3 style={{ color: 'wheat' }} className="form-title">Import a file to extract informations</h3>
          <ImportDataScan />
        </Form>
      </div>

    </div >
  )
}

export default ImportDataScanPage