import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLazyFindUniqueQuery as useLazyFindUniqueHostsQuery } from '../../services/host.service'
import './VigilantPage.css'
import { isIpOrDomain } from '../../common/is-domain-or-ips'

import logo from '../assets/nvigilant_logo_cropped.png'
import { icons } from '../../common/icons/icons'
const VigilantPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [fetchHost, { data: hostData, error: hostError, isLoading: hostIsLoading }] = useLazyFindUniqueHostsQuery()

  const [visibleReferences, setVisibleReferences] = useState<{ [key: number]: boolean }>({});
  const [ipAddress, setIpAddress] = useState({
    ip: (location.state as string) || '',
  })

  const toggleReferences = (id: number) => {
    setVisibleReferences((prev) => ({
      ...prev,
      [id]: !prev[id], // Inverte o estado de visibilidade para o ID específico
    }));
  };

  useEffect(() => {
    if ((hostError as any)?.data?.statusCode === 401) {
      localStorage.removeItem('user')
      navigate('/panel')
    }
  }, [hostError, hostData, navigate])

  useEffect(() => {
    if (hostData) return
    if (ipAddress.ip) {
      const isDomain = isIpOrDomain(ipAddress.ip)
      if (isDomain === 'IP' || isDomain === 'DOMAIN') {
        fetchHost(ipAddress.ip, true)
      }
    }
  }, [hostData])


  const handleFetchHosts = () => {
    // validateToken()
    const isDomain = isIpOrDomain(ipAddress.ip) // Verifica se o IP é válido
    if (isDomain === 'IP') {
      fetchHost(ipAddress.ip, true) // Passa o IP como parâmetro
    }
    if (isDomain === 'DOMAIN') {
      fetchHost(ipAddress.ip, true)
    }
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
        <h3 style={{ color: 'wheat' }} className="form-title">Search for vulnerabilities by IP or Domain</h3>
        <Form>
          <Form.Group controlId="ipAddress">
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Enter your IP address or domain here"
              value={ipAddress.ip}
              onChange={(e) => setIpAddress({ ip: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <div className="filter-buttons" style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button onClick={handleFetchHosts} disabled={!ipAddress.ip || hostIsLoading}>
              {hostIsLoading ? 'Finding...' : <>Find {icons.find}</>}
            </Button>
            <div>
              <Button onClick={() => goToList()}>
                List {icons.list}
              </Button>
            </div>
          </div>
        </Form>
      </div>
      {hostIsLoading ? (
        <h3>Loading...</h3>
      ) : hostError ? (
        <p className="error-message">
          Error fetching hosts{' '}
          {hostError && 'data' in hostError && (hostError.data as any)?.message || ''}
        </p>
      ) : (
        <div className="host-info">
          {hostData?.id && hostData.hostnames.length > 0 && (
            <div className="host-card">
              <strong>Hostnames:</strong> {hostData.hostnames.join(', ')}
            </div>
          )}
          {hostData?.id && hostData?.cpes?.length > 0 && (
            <div className="host-card">
              <strong>CPES:</strong> {hostData.cpes.join(', ')}
            </div>
          )}
          {hostData?.id && hostData?.portNumbers?.length > 0 && (
            <div className="host-card">
              <strong>PORTS:</strong> {hostData.portNumbers.join(', ')}
            </div>
          )}
          {hostData?.id && hostData?.cves?.length > 0 && (
            <div className="host-card">
              <strong>CVES:</strong> {hostData.cves.join(', ')}
            </div>
          )}
          {hostData?.id && hostData?.vulnerabilities?.length > 0 && (
            <div className="host-card">
              <strong>scan:</strong>
              <ul>
                {hostData.vulnerabilities.map((vuln: any) => (
                  <li key={vuln.id}>
                    <strong>{vuln.cve}</strong>: {vuln.title}
                    {vuln.references && vuln.references.length > 0 && (
                      <>
                        <button
                          onClick={() => toggleReferences(vuln.id)}
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                        >
                          {visibleReferences[vuln.id] ? 'Hide References' : 'Show References'}
                        </button>
                        {visibleReferences[vuln.id] && (
                          <ul>
                            {vuln.references.map((ref: any, index: any) => (
                              <li key={index}>
                                <a href={ref} target="_blank" rel="noopener noreferrer">
                                  {ref}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div>
        <h3 style={{ color: 'wheat' }}>
          Other services
        </h3>
      </div>
    </div >
  )
}

export default VigilantPage