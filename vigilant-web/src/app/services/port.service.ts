import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { IPort } from '../interfaces/port.model.'

export const portsApi = createApi({
  reducerPath: 'portsApi',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/ports`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    findUnique: build.query<any, IPort>({
      query: ({ hostId, portId }) => ({
        method: 'GET',
        url: `?hostId=${hostId}?portId=${portId}`,
      }),
    }),
  }),

})
export const { useLazyFindUniqueQuery } = portsApi
