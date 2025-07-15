// src/components/CveSelect.tsx
import { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useLazyFindManyCpesQuery } from '../../services/cpes.service'

interface Props {
  onChange: (value: string) => void
  placeholder?: string
}

const CpeSelect = ({ onChange }: Props) => {
  const [fetchData, { data, isLoading, isError }] = useLazyFindManyCpesQuery()

  useEffect(() => {
    fetchData({
      take: String(50000),
      skip: String(0),
    })
  }, [])


  return (
    <>
      <Form.Label style={{ color: 'wheat' }}>Filter by CPEs</Form.Label>
      <Form.Select
        style={{ backgroundColor: 'grey' }}
        disabled={isLoading || isError}
        onChange={(e) => onChange(e.target.value)}
      >
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
