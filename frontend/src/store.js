import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice'; 
import requestSlice from './slice/requestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestSlice,
  },
});

export default store;
