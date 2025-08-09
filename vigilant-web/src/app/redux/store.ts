import { configureStore } from '@reduxjs/toolkit'
import { authAPI } from '../services/auth.service'
import { calculatorReducer } from './slices/articles.slice'
import { authReducer } from './slices/auth.slice'
import { generalReducer } from './slices/general.slice'
import { userReducer } from './slices/user.slice'
import { userAPI } from '../services/user.service'
import { messageApi } from '../services/telegram-bots.service'
import { hostsApi } from '../services/host.service'
import { scansApi } from '../services/scan-queue.service'
import { urlScanAPI } from '../services/url-scan.service'
import { hostFileManagerAPI } from '../services/host-files-manager.service'
import { vulnerabilitiesAPI } from '../services/vulnerabilities.service'
import { cpesApi } from '../services/cpes.service'

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    articlesReducer: calculatorReducer,
    generalReducer,

    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [hostsApi.reducerPath]: hostsApi.reducer,
    [scansApi.reducerPath]: scansApi.reducer,
    [urlScanAPI.reducerPath]: urlScanAPI.reducer,
    [hostFileManagerAPI.reducerPath]: hostFileManagerAPI.reducer,
    [vulnerabilitiesAPI.reducerPath]: vulnerabilitiesAPI.reducer,
    [cpesApi.reducerPath]: cpesApi.reducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat([authAPI.middleware])
    .concat([userAPI.middleware])
    .concat([messageApi.middleware])
    .concat([hostsApi.middleware])
    .concat([scansApi.middleware])
    .concat([urlScanAPI.middleware])
    .concat([hostFileManagerAPI.middleware])
    .concat([cpesApi.middleware])
    .concat([vulnerabilitiesAPI.middleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
