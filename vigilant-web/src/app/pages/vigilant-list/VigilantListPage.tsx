import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { useLazyDashboardCountryQuery, useLazyDashboardStatusQuery, useLazyFindManyHostQuery } from '../../services/host.service'
import './VigilantListPage.css'
import logo from '../assets/nvigilant_logo_cropped.png'
import { icons } from '../../common/icons/icons'
import { calculateRisk } from '../../common/calculate-risk'
import CveSelect from '../../components/selects/CveSelect'
import CpeSelect from '../../components/selects/CpeSelect'
import { HostStatus } from '../../services/model/host.dto'
import { PaginationDto } from '../../services/model/pagination.dto'
import DashboardMaps from './DashboardMap'
import PieChart from '../../components/charts/PieCharts'
const VigilantListPage = () => {
  const navigate = useNavigate()
  const [fetchManyHosts, { data: hostManyData, error: hostManyError, isLoading: hostManyIsLoading }] = useLazyFindManyHostQuery()
  const [fetchDashboardCountry, { data: dashboardCountryData }] = useLazyDashboardCountryQuery()
  const [fetchDashboardStatus, { data: dashboardStatusData }] = useLazyDashboardStatusQuery()
  const [pagination, setPagination] = useState<PaginationDto>({ skip: 0, take: 20 })
  const [query, setQuery] = useState({
    cves: '',
    cpes: '',
    ports: '',
  })
  const goToHost = (ipAddress: string) => {
    navigate('/find', { state: ipAddress })
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
    const filters = {
      ports: query.ports,
      cves: query.cves,
      cpes: query.cpes
    }
    fetchDashboardCountry(filters)
    fetchDashboardStatus(filters)
    fetchManyHosts({
      ...filters,
      take: String(pagination.take),
      skip: String(pagination.skip)
    })
  }, [pagination])


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
            <Form.Group controlId="cves" style={{ marginBottom: '1rem' }} >
              <CveSelect
                onChange={(val) => setQuery(({ ...query, cves: val || '' }))}
                value={query.cves}
              />
            </Form.Group>
            <Form.Group controlId="cpes" style={{ marginBottom: '1rem' }} >
              <CpeSelect
                value={query.cpes}
                onChange={(val) => setQuery(({ ...query, cpes: val || '' }))}
              />
            </Form.Group>
            <Form.Group controlId="ports" style={{ marginBottom: '1rem' }} >
              <Form.Label style={{ color: 'wheat' }}>Filter by Ports</Form.Label>
              <Form.Control
                style={{ backgroundColor: 'grey' }}
                type="text"
                placeholder="example: 80,443..."
                value={query.ports}
                onChange={(e) => setQuery({ ...query, ports: e.target.value })} // Atualiza o estado
              />
            </Form.Group>

            <div className="filter-buttons" style={{
              marginTop: '20px',
              display: 'flex',
            }}>
              <Button onClick={handleFetchHosts}
                disabled={hostManyIsLoading || (!query.cves && !query.cpes && !query.ports)}
              >
                {hostManyIsLoading ? 'Searching...' : <>Search {icons.find}</>}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery({ cves: '', cpes: '', ports: '' })
                  setPagination({ skip: 0, take: 20 })
                }}
                disabled={hostManyIsLoading || (!query.cves && !query.cpes && !query.ports)}
              >
                Clear
              </Button>
              <div>
                <Button onClick={handlePrevious} disabled={pagination.skip === 0} style={{ marginRight: '10px' }}>
                  Previous
                </Button>
                <Button onClick={handleNext} disabled={hostManyIsLoading}>
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
                  className={`status ${host.status === HostStatus.UP
                    ? 'status-up'
                    : host.status === HostStatus.DOWN
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
                <br />
                <strong>Last update: </strong>
                {new Date(host.updatedAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            ))}
          </div>
        )}
      </div>

    </div >
  )
}

export default VigilantListPage