import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { FileUpload } from './model/files'
import { urlFileApiProd } from '../common/base-url'

export const filesAPi = createApi({
  reducerPath: 'filesAPi',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlFileApiProd}/upload-by-user`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    uploadFile: build.mutation<{ message: string }, FileUpload>({
      query: ({ folderName, formData }) => ({
        url: `${folderName}`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),

})
export const { useUploadFileMutation } = filesAPi
