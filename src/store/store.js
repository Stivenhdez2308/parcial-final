import { configureStore } from '@reduxjs/toolkit';
import cityNetworkReducer from './cityNetworkSlice';

export const store = configureStore({
    reducer: {
        cityNetwork: cityNetworkReducer
    }
}); 