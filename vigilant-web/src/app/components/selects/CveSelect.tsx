import { useLazyFindManyVulnerabilitiesQuery } from '../../services/vulnerabilities.service'
import { AsyncPaginate } from "react-select-async-paginate";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { icons } from '../../common/icons/icons';

interface Props {
  onChange: (value: string | null) => void
  value?: string
}

const CveSelect = ({ onChange, value }: Props) => {
  const [fetchData] = useLazyFindManyVulnerabilitiesQuery()

  const loadOptions = async (
    inputValue: string,
    loadedOptions: any[],
    { page }: any
  ) => {
    const { items, total } = await fetchData({
      take: 20,
      skip: page * 20,
      cve: inputValue,
    }).unwrap()

    return {
      options: items.map((item) => ({
        value: item.cve,
        label: item.cve,
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
        <strong>CVE (Common Vulnerabilities and Exposures)</strong><br />
        Identifier known vulnerabilities in software and hardware.
      </div>
    </Tooltip>
  )

  return (
    <div>
      <label style={{ color: 'wheat' }}>
        Filter by CVEs{" "}
        <OverlayTrigger placement="right" delay={{ show: 200, hide: 100 }} overlay={renderTooltip}>
          <span style={{ cursor: 'pointer', color: 'orange' }}>
            {icons.question}
          </span>
        </OverlayTrigger>
      </label>
      <AsyncPaginate
        value={value ? { value, label: value } : null}
        loadOptions={loadOptions as any}
        onChange={(selected: any) => onChange(selected?.value || null)}
        placeholder="Search by CVEs..."
        additional={{ page: 0 }}
        debounceTimeout={400}
        isClearable
      />
    </div>
  )
}

export default CveSelect
