import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { IQueueScan } from '../interfaces/scan.model'

export const scansApi = createApi({
  reducerPath: 'scansApi',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/scan`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    scan: build.mutation<{ message: string }, IQueueScan>({
      query: ({ target }) => ({
        url: ``,
        method: 'POST',
        body: { target },
      }),
    }),
    status: build.query<any, IQueueScan>({
      query: ({ target }) => ({
        url: `${target}/status`,
        method: 'GET',
      }),
    }),
  }),

})
export const { useScanMutation, useStatusQuery, useLazyStatusQuery } = scansApi
