import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducer/userReducer'; // Adjust the path as needed
import { productAPI } from './api/productApi';
import { cartReducer } from './reducer/cartReducer';
import { orderApi } from './api/orderAPI';
import { userAPI } from './api/userAPI';
import { dashboardApi } from './api/dashboardApi';

const store = configureStore({
  reducer: {
    user: userReducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [cartReducer.name]: cartReducer.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productAPI.middleware , orderApi.middleware,  userAPI.middleware , dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
