import Form from 'react-bootstrap/Form'
import '../vigilant-list/VigilantListPage.css'
import logo from '../assets/nvigilant_logo_cropped.png'
import ImportDataScan from './components/FileScanUpload'
const ImportDataScanPage = () => {

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