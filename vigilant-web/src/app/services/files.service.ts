import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { ExtractResponse, CrawlerByUpload, CrawlerByUrl } from './model/files'
import { urlFileApiProd } from '../common/base-url'

export const filesAPi = createApi({
  reducerPath: 'filesAPi',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlFileApiProd}`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    uploadFile: build.mutation<ExtractResponse, CrawlerByUpload>({
      query: ({ folderName, formData }) => ({
        url: `crawler-by-upload/${folderName}`,
        method: 'POST',
        body: formData,
      }),
    }),
    url: build.mutation<ExtractResponse, CrawlerByUrl>({
      query: ({ url }) => ({
        url: `crawler-by-url`,
        method: 'POST',
        body: { url },
      }),
    }),
  }),

})
export const { useUploadFileMutation } = filesAPi
