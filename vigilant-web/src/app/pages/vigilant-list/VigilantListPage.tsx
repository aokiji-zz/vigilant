import { useEffect, useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { useLazyFindManyHostQuery } from '../../services/host.service'
import './VigilantListPage.css'
import logo from '../assets/nvigilant_logo_cropped.png'
import { icons } from '../../common/icons/icons'
import DashboardMaps from './dashboard-map'
const VigilantListPage = () => {
  const navigate = useNavigate()
  const [fetchManyHosts, { data: hostManyData, error: hostManyError, isLoading: hostManyIsLoading }] = useLazyFindManyHostQuery()
  const [pagination, setPagination] = useState({ skip: 0, take: 20 })
  const [query, setQuery] = useState({
    cves: '',
    cpes: '',
    ports: '',
  })
  const goToHost = (ipAddress: string) => {
    navigate('/', { state: ipAddress })
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
  const handleNext = () => {
    setPagination(prev => ({ ...prev, skip: prev.skip + prev.take }))
  }


  const handlePrevious = () => {
    setPagination(prev => ({ ...prev, skip: Math.max(prev.skip - prev.take, 0) }))
  }

  useEffect(() => {
    if (hostManyData) {
      fetchManyHosts({
        take: String(pagination.take),
        skip: String(pagination.skip),
        ports: query.ports,
        cves: query.cves,
        cpes: query.cpes
      })
    }
    if (!hostManyData) {
      fetchManyHosts({
        take: String(pagination.take),
        skip: String(pagination.skip),
      })
    }
  }, [pagination, hostManyData])

  const countryPopularityData = useMemo(() => {
    if (!hostManyData) return [["Country", "Popularity"]]; // também corrige retorno vazio

    const counts = hostManyData.reduce((acc, host) => {
      const country = host?.whois?.country;
      if (!country) return acc;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData: (string | number)[][] = [["Country", "Popularity"]];
    for (const [country, count] of Object.entries(counts)) {
      chartData.push([country, count]);
    }

    return chartData;
  }, [hostManyData]);



  return (
    <div className="container-vigilant">
      <img src={logo} style={{
        height: '2rem',
        marginBottom: '2rem'
      }} />
      <div className="filter-container">
        <div className="map-section">
          <DashboardMaps data={countryPopularityData} />
        </div>
        <div className="filter">
          <h3 style={{ color: 'wheat' }} className="form-title">TARGET LIST</h3>
          <Form style={{ width: '18rem' }}>
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
      </div>

      <div>
        {hostManyError ? (
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
                <strong>Country by registration: </strong>
                {host?.whois?.country} <span className={`fi fi-${host?.whois?.country.toLowerCase()}`}></span>
                <br />
                <strong>Recently CVE: </strong>
                {host.cves?.[0]}
                <br />
                <strong>Ports: </strong>
                {host.portNumbers?.join(' | ')}
                <strong>Status: </strong>
                <span className={`status ${host.status === 'UP' ? 'status-up' : 'status-down'}`}>
                  {host.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div >
  )
}

export default VigilantListPage