import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { Vulnerability, VulnerabilityWithTotal } from './model/vulnerabilities.dto'
import { PaginationDto } from './model/pagination.dto'

export const vulnerabilitiesAPI = createApi({
  reducerPath: 'vulnerabilitiesAPI',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/vulnerabilities`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    findManyVulnerabilities: build.query<VulnerabilityWithTotal, PaginationDto>({
      query: ({ take, skip, cve }) => {
        const params = new URLSearchParams();
        if (take) params.append('take', take.toString());
        if (skip) params.append('skip', skip.toString());
        if (cve) params.append('cve', cve.toString());
        return {
          method: 'GET',
          url: `findMany?${params.toString()}`,
        };
      },
    }),
    findUniqueVulnerability: build.query<Vulnerability, { cve: string }>({
      query: ({ cve }) => {
        return {
          method: 'GET',
          url: `findUnique?${cve}`,
        };
      },
    }),

  }),

})
export const { useLazyFindManyVulnerabilitiesQuery, useLazyFindUniqueVulnerabilityQuery } = vulnerabilitiesAPI
