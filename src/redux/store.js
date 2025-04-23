import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import authReducer from './authSlice';
// Configure the Redux store
const store = configureStore({
    reducer: {
        todos: todoReducer,
        auth: authReducer,
    },
});
export default store;
