import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'

export const messageApi = createApi({
  reducerPath: 'messageApi',
  tagTypes: ['Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/telegramBots`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      console.log('messageApi:: prepareHeaders access_token:', access_token)
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({

    sendMessage: build.mutation<any, any>({
      query: ({ age, name, phoneNumber, code, id, chatId, uuid }) => ({
        method: 'POST',
        body: { age, name, phoneNumber, code, id, chatId, uuid },
        url: `sendMessage`,
      }),
    }),
  }),
})
export const { useSendMessageMutation } = messageApi
