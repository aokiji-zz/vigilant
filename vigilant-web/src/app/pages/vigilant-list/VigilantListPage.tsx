import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { useLazyFindManyHostQuery, useLazyFindUniqueQuery as useLazyFindUniqueHostsQuery } from '../../services/host.service'
import './VigilantListPage.css'
import { useScanMutation } from '../../services/scan-queue.service'
import logo from '../assets/nvigilant_logo_cropped.png'

const VigilantListPage = () => {
  const navigate = useNavigate()
  const [fetchManyHosts, { data: hostManyData, error: hostManyError, isLoading: hostManyIsLoading }] = useLazyFindManyHostQuery()
  const [fetchScan, { data: scanData, isLoading: scanIsLoading, isError: scanIsError }] = useScanMutation()

  const [query, setQuery] = useState({
    cves: '',
    cpes: '',
    ports: '',
    range: ''
  })

  useEffect(() => {
    if ((hostManyError as any)?.data?.statusCode === 401) {
      localStorage.removeItem('user')
      navigate('/')
    }
  }, [hostManyError, hostManyData, navigate])


  const handleFetchHosts = () => {
    if (!query.range) {
      fetchManyHosts({ take: '20', skip: '0', ports: query.ports, cves: query.cves, cpes: query.cpes })
    }
    if (query.range && !query.cpes && !query.cves && !query.ports) {
      fetchScan({ target: query.range })
    }
  }
  const handleHost = (ipAddress: string) => {
    navigate('/vigilant', { state: ipAddress })
  }
  return (
    <div className="container-vigilant">
      <img src={logo} style={{
        height: '2rem',
        marginBottom: '2rem'
      }} />
      <div className="filter">
        <h3 style={{ color: 'wheat' }} className="form-title">TARGET LIST</h3>
        <Form>
          <Form.Group controlId="ipAddress">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Filter by CVE's"
              value={query.cves}
              onChange={(e) => setQuery({ ...query, cves: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <Form.Group controlId="cpes">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Filter by CPE's"
              value={query.cpes}
              onChange={(e) => setQuery({ ...query, cpes: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <Form.Group controlId="ports">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Filter by PORTS"
              value={query.ports}
              onChange={(e) => setQuery({ ...query, ports: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <h3 style={{ color: 'wheat', marginTop: '2rem' }}>
            Schedule a scan range for a complete analisys
          </h3>
          <Form.Group controlId="ports">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="192.168.1-255"
              value={query.range}
              onChange={(e) => setQuery({ ...query, range: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <Button onClick={handleFetchHosts} style={{ marginTop: '20px' }}>
            {hostManyIsLoading ? 'Finding...' : 'Find'}
          </Button>
        </Form>
      </div>
      <div>
        {hostManyIsLoading ? (
          <h3 style={{ color: 'wheat' }}>Loading informations...</h3>
        ) : hostManyError ? (
          <p className="error-message">
            Error fetching hosts{' '}
            {hostManyError && 'data' in hostManyError && (hostManyError.data as any)?.message || ''}
          </p>
        ) : (
          <div className="host-info">
            {hostManyData?.map((host) => (
              <div key={host.id} className="host-card">
                <strong>Host:</strong>
                <Button onClick={() => handleHost(host.ipAddress || '')}>
                  {host.ipAddress}
                </Button>
                <br />
                <strong>Recently CVE's:</strong>
                <Button onClick={() => handleHost(host.cves?.[0] || '')}>
                  {host.cves?.[0]}
                </Button>
              </div>
            ))}
          </div>
        )}
        {scanData?.message && (<p className="error-message">{scanData.message}</p>)}
      </div>

    </div >
  )
}

export default VigilantListPage