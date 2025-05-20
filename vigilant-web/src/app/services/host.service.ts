import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { Host } from './model/host'

export const hostsApi = createApi({
  reducerPath: 'hostsApi',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/hosts`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    findManyHost: build.query<Host[], any>({
      query: ({ take, skip, ports, cves, cpes }) => {
        const params = new URLSearchParams();

        if (take) params.append('take', take);
        if (skip) params.append('skip', skip);
        if (ports) params.append('ports', ports);
        if (cves) params.append('cves', cves);
        if (cpes) params.append('cpes', cpes);

        return {
          method: 'GET',
          url: `findMany?${params.toString()}`,
        };
      },
    }),
    dashboardCountry: build.query<any, any>({
      query: ({ ports, cves, cpes }) => {
        const params = new URLSearchParams();
        if (ports) params.append('ports', ports);
        if (cves) params.append('cves', cves);
        if (cpes) params.append('cpes', cpes);
        return {
          method: 'GET',
          url: `dashboard/country?${params.toString()}`,
        };
      },
    }),
    dashboardStatus: build.query<any, any>({
      query: ({ ports, cves, cpes }) => {
        const params = new URLSearchParams();
        if (ports) params.append('ports', ports);
        if (cves) params.append('cves', cves);
        if (cpes) params.append('cpes', cpes);
        return {
          method: 'GET',
          url: `dashboard/status?${params.toString()}`,
        };
      },
    }),
    findUnique: build.query<any, string>({
      query: (ipAddressOrDomain) => ({
        method: 'GET',
        url: `ip?ipAddressOrDomain=${ipAddressOrDomain}`,
      }),
    }),
  }),

})
export const { useLazyFindManyHostQuery, useLazyFindUniqueQuery, useLazyDashboardCountryQuery, useLazyDashboardStatusQuery } = hostsApi
