import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { useLazyFindManyHostQuery, useLazyFindUniqueQuery as useLazyFindUniqueHostsQuery } from '../../services/host.service'
import './VigilantPage.css'
import { isIpOrDomain } from '../../common/is-domain-or-ips'
import { useLazyStatusQuery, useScanMutation } from '../../services/scan-queue.service'
import FileUpload from '../../components/FileUpload'

const VigilantPage = () => {
  const navigate = useNavigate()
  const [fetchHosts, { data: hostData, error: hostError, isLoading: hostIsLoading }] = useLazyFindUniqueHostsQuery()
  const [fetchManyHosts, { data: hostManyData, error: hostManyError, isLoading: hostManyIsLoading }] = useLazyFindManyHostQuery()
  const [fetchScan, { data: scanData, isLoading: scanIsLoading, isError: scanIsError }] = useScanMutation()

  const [visibleReferences, setVisibleReferences] = useState<{ [key: number]: boolean }>({});
  const [ipAddress, setIpAddress] = useState({
    ip: '',
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
      navigate('/')
    }
  }, [hostError, hostData, navigate])


  const handleFetchHosts = () => {
    // validateToken()
    const isDomain = isIpOrDomain(ipAddress.ip) // Verifica se o IP é válido
    if (isDomain === 'IP') {
      fetchHosts(ipAddress.ip, true) // Passa o IP como parâmetro
    }
    if (isDomain === 'DOMAIN') {
      // fetchScan({ target: ipAddress.ip }) // Passa o IP como parâmetro
      fetchHosts(ipAddress.ip, true)
    }
    if (isDomain === 'IP_RANGE') {
      fetchScan({ target: ipAddress.ip }) // Passa o IP como parâmetro
    }
    if (isDomain === 'INVALID') {
      fetchManyHosts({ take: '10', skip: '0', ports: '', cves: '', cpes: '' })
    }
  }

  return (
    <div className="container-vigilant">
      <div className="filter">
        <h3 className="form-title">Find by IP Address or Domain</h3>
        <Form>
          <Form.Group controlId="ipAddress">
            <Form.Label>IP Address</Form.Label>
            <Form.Control
              style={{ backgroundColor: 'grey' }}
              type="text"
              placeholder="Enter your IP address or domain here"
              value={ipAddress.ip}
              onChange={(e) => setIpAddress({ ip: e.target.value })} // Atualiza o estado
            />
          </Form.Group>
          <Button onClick={handleFetchHosts} style={{ marginTop: '20px' }}>
            {hostIsLoading ? 'Loading...' : 'Find'}
          </Button>
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
        {hostManyIsLoading ? (
          <h3>Loading...</h3>
        ) : hostManyError ? (
          <p className="error-message">
            Error fetching hosts{' '}
            {hostManyError && 'data' in hostManyError && (hostManyError.data as any)?.message || ''}
          </p>
        ) : (
          <div className="host-info">
            {hostManyData?.map((host: any) => (
              <div key={host.id} className="host-card">
                <strong>Host:</strong> {host.ipAddress}
                <br />

              </div>
            ))}
          </div>
        )}
      </div>

    </div >
  )
}

export default VigilantPage