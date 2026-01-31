import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { api } from '@/apis/baseApi';

// Import your slices here
// import userReducer from './slices/userSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [], // Add slice names to persist: ['user']
    blacklist: [api.reducerPath], // Don't persist RTK Query cache
};

const rootReducer = combineReducers({
    // Add your reducers here
    // user: userReducer,
    [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(api.middleware),
});

export const persistor = persistStore(store);
export default store;
