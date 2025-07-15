import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { Cpe } from './model/cpes.dto'

export const cpesApi = createApi({
  reducerPath: 'cpesApi',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/cpes`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    findManyCpes: build.query<Cpe[], any>({
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
  }),

})
export const { useLazyFindManyCpesQuery } = cpesApi
