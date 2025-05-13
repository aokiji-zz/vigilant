import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { useLazyFindManyHostQuery, useLazyFindUniqueQuery as useLazyFindUniqueHostsQuery } from '../../services/host.service'
import './VigilantListPage.css'
import logo from '../assets/nvigilant_logo_cropped.png'
import { icons } from '../../common/icons/icons'
const VigilantListPage = () => {
  const navigate = useNavigate()
  const [fetchManyHosts, { data: hostManyData, error: hostManyError, isLoading: hostManyIsLoading }] = useLazyFindManyHostQuery()
  const [pagination, setPagination] = useState({ skip: 0, take: 20 })
  const [query, setQuery] = useState({
    cves: '',
    cpes: '',
    ports: '',
    range: ''
  })
  const goToHost = (ipAddress: string) => {
    navigate('/vigilant', { state: ipAddress })
  }

  const handleFetchHosts = () => {
    fetchManyHosts({
      take: String(pagination.take),
      skip: String(pagination.skip),
      ports: query.ports,
      cves: query.cves,
      cpes: query.cpes
    })
  }

  useEffect(() => {
    if ((hostManyError as any)?.data?.statusCode === 401) {
      localStorage.removeItem('user')
      navigate('/')
    }
    handleFetchHosts()
  }, [hostManyError, hostManyData, navigate, pagination])

  const handleNext = () => {
    setPagination(prev => ({ ...prev, skip: prev.skip + prev.take }))
  }


  const handlePrevious = () => {
    setPagination(prev => ({ ...prev, skip: Math.max(prev.skip - prev.take, 0) }))
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
          <Form.Group controlId="ipAddress" style={{ marginBottom: '1rem' }} >
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Filter by CVE's"
              value={query.cves}
              onChange={(e) => setQuery({ ...query, cves: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <Form.Group controlId="cpes" style={{ marginBottom: '1rem' }} >
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Filter by CPE's"
              value={query.cpes}
              onChange={(e) => setQuery({ ...query, cpes: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <Form.Group controlId="ports" style={{ marginBottom: '1rem' }} >
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Filter by PORTS"
              value={query.ports}
              onChange={(e) => setQuery({ ...query, ports: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <h3 style={{ color: 'wheat', marginBottom: '1rem' }}>
            Schedule a scan range for a complete analisys
          </h3>
          <Form.Group controlId="ports" style={{ marginBottom: '1rem' }}>
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="192.168.1-255"
              value={query.range}
              onChange={(e) => setQuery({ ...query, range: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <div className="filter-buttons" style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button onClick={handleFetchHosts}>
              {hostManyIsLoading ? 'Finding...' : <>Find {icons.find}</>}
            </Button>
            <div>
              <Button onClick={handlePrevious} disabled={pagination.skip === 0} style={{ marginRight: '10px' }}>
                Previous
              </Button>
              <Button onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>

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
                <Button onClick={() => goToHost(host.ipAddress || '')}>
                  {host.ipAddress}
                </Button>
                <br />
                <strong>Recently CVE's:</strong>
                <Button>
                  {host.cves?.[0]}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div >
  )
}

export default VigilantListPage