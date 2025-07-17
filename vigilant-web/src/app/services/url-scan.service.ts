import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { ExtracrUrlInput, ExtractedUrlResponse } from './model/extract-url.dto'

export const urlScanAPI = createApi({
  reducerPath: 'urlScanAPI',
  tagTypes: ['POST'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/urlScan`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    extractUrl: build.mutation<ExtractedUrlResponse, ExtracrUrlInput>({
      query: ({ url }) => ({
        method: 'POST',
        body: { url },
        url: `crawler/extract-url`,
      }),
    }),
  }),

})
export const { useExtractUrlMutation } = urlScanAPI
