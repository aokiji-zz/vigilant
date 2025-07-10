import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { urlBaseApiProd } from '../common/base-url'
import { HostFileManagerUpload } from './model/host-files-manager.dto'

export const hostFileManagerAPI = createApi({
  reducerPath: 'hostFileManagerAPI',
  tagTypes: ['Post', 'Get'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${urlBaseApiProd}/host-file-manager`,
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer
      if (access_token) {
        headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    uploadFile: build.mutation<number, HostFileManagerUpload>({
      query: ({ formData }) => ({
        url: `upload`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),

})
export const { useUploadFileMutation } = hostFileManagerAPI
