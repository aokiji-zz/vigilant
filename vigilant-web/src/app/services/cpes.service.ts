import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { CpeWithTotal } from './model/cpes.dto'
import { PaginationDto } from './model/pagination.dto'

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
    findManyCpes: build.query<CpeWithTotal, PaginationDto>({
      query: ({ take, skip, name }) => {
        const params = new URLSearchParams();

        if (take) params.append('take', take.toString());
        if (skip) params.append('skip', skip.toString());
        if (name) params.append('name', name.toString());


        return {
          method: 'GET',
          url: `findMany?${params.toString()}`,
        };
      },
    }),
  }),

})
export const { useLazyFindManyCpesQuery } = cpesApi
