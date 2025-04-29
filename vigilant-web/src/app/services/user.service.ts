import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'

export const userAPI = createApi({
  reducerPath: 'userAPI',
  tagTypes: ['Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/users`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      console.log('userAPI:: prepareHeaders access_token:', access_token)
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    createUser: build.mutation<any, any>({
      query: ({ age, name, phoneNumber }) => ({
        method: 'POST',
        body: { age, name, number: phoneNumber },
        url: `create`,
      }),
    }),
  }),
})
export const { useCreateUserMutation, } = userAPI
