import { configureStore } from '@reduxjs/toolkit'
import { authAPI } from '../services/auth.service'
import { calculatorReducer } from './slices/articles.slice'
import { authReducer } from './slices/auth.slice'
import { generalReducer } from './slices/general.slice'
import { userReducer } from './slices/user.slice'
import { userAPI } from '../services/user.service'
import { telegramBotsAPI } from '../services/telegram-bots.service'
import { hostsApi } from '../services/host.service'
import { scansApi } from '../services/scan-queue.service'

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    articlesReducer: calculatorReducer,
    generalReducer,

    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [telegramBotsAPI.reducerPath]: telegramBotsAPI.reducer,
    [hostsApi.reducerPath]: hostsApi.reducer,
    [scansApi.reducerPath]: scansApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat([authAPI.middleware])
    .concat([userAPI.middleware])
    .concat([telegramBotsAPI.middleware])
    .concat([hostsApi.middleware])
    .concat([scansApi.middleware])
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
