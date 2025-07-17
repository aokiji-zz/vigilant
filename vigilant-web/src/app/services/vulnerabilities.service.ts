import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { Vulnerability } from './model/vulnerabilities.dto'

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
    findManyVulnerabilities: build.query<Vulnerability[], { skip: string, take: string }>({
      query: ({ take, skip }) => {
        const params = new URLSearchParams();
        if (take) params.append('take', take);
        if (skip) params.append('skip', skip);
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
