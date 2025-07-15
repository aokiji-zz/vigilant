// src/components/CveSelect.tsx
import { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useLazyFindManyVulnerabilitiesQuery } from '../../services/vulnerabilities.service'

interface Props {
  onChange: (value: string) => void
  placeholder?: string
}

const CveSelect = ({ onChange }: Props) => {
  const [fetchData, { data, isLoading, isError }] = useLazyFindManyVulnerabilitiesQuery()

  useEffect(() => {
    fetchData({
      take: String(50000),
      skip: String(0),
    })
  }, [])


  return (
    <>
      <Form.Label style={{ color: 'wheat' }}>Filter by CVEs</Form.Label>
      <Form.Select
        style={{ backgroundColor: 'grey' }}
        disabled={isLoading || isError}
        onChange={(e) => onChange(e.target.value)}
      >
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
