import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for the state and actions
interface AuthState {
  token: string | null;
  email: string | null;
  error: string | null;
  registerMessage: string | null;
}

interface UserCredentials {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  token: string;
  email: string;
}

// Register action
export const register = createAsyncThunk<string, UserCredentials, { rejectValue: string }>(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", userData);
      return res.data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// Login action
export const login = createAsyncThunk<LoginResponse, UserCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", credentials);
      const { token, email } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(email));
      return { token, email };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const initialState: AuthState = {
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
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Login failed";
      })

      // Register
      .addCase(register.fulfilled, (state, action: PayloadAction<string>) => {
        state.registerMessage = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
