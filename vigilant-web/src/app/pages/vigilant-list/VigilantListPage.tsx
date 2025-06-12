import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { useLazyDashboardCountryQuery, useLazyFindManyHostQuery, useLazyDashboardStatusQuery } from '../../services/host.service'
import './VigilantListPage.css'
import logo from '../assets/nvigilant_logo_cropped.png'
import { icons } from '../../common/icons/icons'
import DashboardMaps from './DashboardMap'
import PieChart from '../../components/charts/PieCharts'
import { calculateRisk } from '../../common/calculate-risk'
const VigilantListPage = () => {
  const navigate = useNavigate()
  const [fetchManyHosts, { data: hostManyData, error: hostManyError, isLoading: hostManyIsLoading }] = useLazyFindManyHostQuery()
  const [fetchDashboardCountry, { data: dashboardCountryData }] = useLazyDashboardCountryQuery()
  const [fetchDashboardStatus, { data: dashboardStatusData }] = useLazyDashboardStatusQuery()
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
    fetchDashboardCountry({
      ports: query.ports,
      cves: query.cves,
      cpes: query.cpes
    })
    fetchDashboardStatus({
      ports: query.ports,
      cves: query.cves,
      cpes: query.cpes
    })
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
      fetchDashboardCountry({
        ports: query.ports,
        cves: query.cves,
        cpes: query.cpes
      })
      fetchDashboardStatus({
        take: String(pagination.take),
        skip: String(pagination.skip),
      })
      fetchManyHosts({
        take: String(pagination.take),
        skip: String(pagination.skip),
      })

    }
  }, [pagination, hostManyData])

  return (
    <div className="container-vigilant">
      <img src={logo} style={{
        height: '2rem',
        marginBottom: '2rem'
      }} />
      <div className="filter-container">
        <div className="map-section">
          <DashboardMaps data={dashboardCountryData || ['Country', "Hosts"]} />
        </div>
        <div className="filter">
          <h3 style={{ color: 'wheat' }} className="form-title">TARGET LIST</h3>
          <Form style={{ width: '18rem' }}>
            <Form.Group controlId="ipAddress" style={{ marginBottom: '1rem' }} >
              <Form.Control
                style={{ backgroundColor: 'grey' }}
                type="text"
                placeholder="by CVE's: CVE-2025-1234"
                value={query.cves}
                onChange={(e) => setQuery({ ...query, cves: e.target.value })} // Atualiza o estado
              />
            </Form.Group>
            <Form.Group controlId="cpes" style={{ marginBottom: '1rem' }} >
              <Form.Control
                style={{ backgroundColor: 'grey' }}
                type="text"
                placeholder="by CPE's"
                value={query.cpes}
                onChange={(e) => setQuery({ ...query, cpes: e.target.value })} // Atualiza o estado
              />
            </Form.Group>
            <Form.Group controlId="ports" style={{ marginBottom: '1rem' }} >
              <Form.Control
                style={{ backgroundColor: 'grey' }}
                type="text"
                placeholder="by PORTS: 80,443..."
                value={query.ports}
                onChange={(e) => setQuery({ ...query, ports: e.target.value })} // Atualiza o estado
              />
            </Form.Group>

            <div className="filter-buttons" style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Button onClick={handleFetchHosts}
                disabled={hostManyIsLoading || (!query.cves && !query.cpes && !query.ports)}
              >
                {hostManyIsLoading ? 'Searching...' : <>Search {icons.find}</>}
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
        <div className="map-section">
          <PieChart data={dashboardStatusData || ['Status', "Count"]} />
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
                <br />
                <strong>Status: </strong>
                <span
                  className={`status ${host.status === 'UP'
                    ? 'status-up'
                    : host.status === 'DOWN'
                      ? 'status-down'
                      : 'status-pending'
                    }`}
                >
                  {host.status || "PENDING"}
                </span>
                <br />
                <strong>Risk Level: </strong>
                <span className={`risk-level risk-${calculateRisk(host).toLowerCase()}`}>
                  {calculateRisk(host)}
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