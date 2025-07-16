// src/components/CveSelect.tsx
import { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useLazyFindManyCpesQuery } from '../../services/cpes.service'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { icons } from '../../common/icons/icons'

interface Props {
  onChange: (value: string) => void
  value?: string

}

const CpeSelect = ({ onChange, value }: Props) => {
  const [fetchData, { data, isLoading, isError }] = useLazyFindManyCpesQuery()

  useEffect(() => {
    fetchData({
      take: String(50000),
      skip: String(0),
    })
  }, [])

  const renderTooltip = (props: any) => (
    <Tooltip id="cpe-tooltip" {...props}>
      <div style={{ maxWidth: '250px' }}>
        <strong>CPE (Common Platform Enumeration)</strong><br />
        A standardized identifier used to describe classes of software, hardware, operating systems, or processes running on a system.
      </div>
    </Tooltip>
  )


  return (
    <>
      <Form.Label style={{ color: 'wheat' }}>
        Filter by CPEs
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
        <option value="">None CPE selected</option>
        {data?.map((item) => (
          <option key={item.name} value={item?.name || ''}>
            {item.name}
          </option>
        ))}
      </Form.Select>
    </>
  )
}

export default CpeSelect
