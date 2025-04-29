import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { urlBaseApiProd } from '../common/base-url'
import { ILoginRequest } from '../interfaces/login.interface'

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/auth`,
  }),
  endpoints: (build) => ({
    login: build.mutation<any, ILoginRequest>({
      query: ({ email }) => ({
        url: `login`,
        method: 'POST',
        body: { email },
      }),
    }),
  }),
})

export const { useLoginMutation } = authAPI
