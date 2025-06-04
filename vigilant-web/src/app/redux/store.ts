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
import { filesAPi } from '../services/files.service'

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
    [filesAPi.reducerPath]: filesAPi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat([authAPI.middleware])
    .concat([userAPI.middleware])
    .concat([messageApi.middleware])
    .concat([hostsApi.middleware])
    .concat([scansApi.middleware])
    .concat([filesAPi.middleware])
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
