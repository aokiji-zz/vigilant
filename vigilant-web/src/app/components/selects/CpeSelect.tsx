import { AsyncPaginate } from "react-select-async-paginate";
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { icons } from '../../common/icons/icons';
import { useLazyFindManyCpesQuery } from '../../services/cpes.service';

interface Props {
  onChange: (value: string | null) => void
  value?: string
}

const CpeSelect = ({ onChange, value }: Props) => {
  const [fetchData] = useLazyFindManyCpesQuery()

  const loadOptions = async (
    inputValue: string,
    loadedOptions: any[],
    { page }: any
  ) => {
    const { items, total } = await fetchData({
      take: 20,
      skip: page * 20,
      name: inputValue,
    }).unwrap()

    return {
      options: items.map((item) => ({
        value: item.name,
        label: item.name,
      })),
      hasMore: (page + 1) * 20 < total,
      additional: {
        page: page + 1,
      },
    }
  }


  const renderTooltip = (props: any) => (
    <Tooltip id="cpe-tooltip" {...props}>
      <div style={{ maxWidth: '250px' }}>
        <strong>CPE (Common Platform Enumeration)</strong><br />
        A standardized identifier used to describe classes of software, hardware, operating systems, or processes running on a system.
      </div>
    </Tooltip>
  )


  return (
    <div>
      <Form.Label style={{ color: 'wheat' }}>
        Filter by CPEs
        <OverlayTrigger placement="right" delay={{ show: 200, hide: 100 }} overlay={renderTooltip}>
          <span style={{ cursor: 'pointer', color: 'orange' }}>
            {icons.question}
          </span>
        </OverlayTrigger>
      </Form.Label>
      <AsyncPaginate
        value={value ? { value, label: value } : null}
        loadOptions={loadOptions as any}
        onChange={(selected: any) => onChange(selected?.value || null)}
        placeholder="Search by CPEs..."
        additional={{ page: 0 }}
        debounceTimeout={400}
        isClearable
      />
    </div>
  )
}

export default CpeSelect
