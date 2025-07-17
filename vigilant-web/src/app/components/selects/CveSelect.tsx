// src/components/CveSelect.tsx
import { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useLazyFindManyVulnerabilitiesQuery } from '../../services/vulnerabilities.service'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { icons } from '../../common/icons/icons'

interface Props {
  onChange: (value: string) => void
  value?: string
}

const CveSelect = ({ onChange, value }: Props) => {
  const [fetchData, { data, isLoading, isError }] = useLazyFindManyVulnerabilitiesQuery()

  useEffect(() => {
    fetchData({
      take: 50000,
      skip: 0,
    })
  }, [])

  const renderTooltip = (props: any) => (
    <Tooltip id="cpe-tooltip" {...props}>
      <div style={{ maxWidth: '250px' }}>
        <strong>CVE (Common Vulnerabilities and Exposures)</strong><br />
        Identifier known vulnerabilities in software and hardware.
        It is essentially a public catalog that assigns a unique identifier (CVE ID) to each vulnerability,
        making it easier to communicate and track security issues.
      </div>
    </Tooltip>
  )

  return (
    <>
      <Form.Label style={{ color: 'wheat' }}>Filter by CVEs
        <OverlayTrigger placement="right" delay={{ show: 200, hide: 100 }} overlay={renderTooltip}>
          <span style={{ cursor: 'pointer', color: 'orange' }}>
            {icons.question}
          </span>
        </OverlayTrigger>
      </Form.Label>
      <Form.Select
        value={value || ''}
        style={{ backgroundColor: 'grey' }}
        disabled={isLoading || isError}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">None CVE selected</option>
        {data?.map((item) => (
          <option key={item.cve} value={item?.cve || ''}>
            {item.cve}
          </option>
        ))}
      </Form.Select>
    </>
  )
}

export default CveSelect
