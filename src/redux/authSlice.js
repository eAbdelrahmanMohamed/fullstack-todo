var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Register action
export const register = createAsyncThunk("auth/register", (userData, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const res = yield axios.post("http://localhost:5000/api/users/register", userData);
        return res.data.message;
    }
    catch (err) {
        return thunkAPI.rejectWithValue(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Registration failed");
    }
}));
// Login action
export const login = createAsyncThunk("auth/login", (credentials, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios.post("http://localhost:5000/api/users/login", credentials);
        const { token, email } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(email));
        return { token, email };
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.response.data.message);
    }
}));
const initialState = {
    token: localStorage.getItem("token") || null,
    email: null,
    error: null,
    registerMessage: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.token = null;
            state.email = null;
            state.error = null;
            state.registerMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.fulfilled, (state, action) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.error = null;
        })
            .addCase(login.rejected, (state, action) => {
            state.error = action.payload || "Login failed";
        })
            // Register
            .addCase(register.fulfilled, (state, action) => {
            state.registerMessage = action.payload;
            state.error = null;
        })
            .addCase(register.rejected, (state, action) => {
            state.error = action.payload || "Registration failed";
        });
    },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
