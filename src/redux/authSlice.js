import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const res = await axios.post("http://localhost:5000/api/users/register", userData);
    return res.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", credentials);
    const { token, email } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(email));
    return { token, email }; 
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    email: null,
    error: null,
    registerMessage: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
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
        state.error = action.payload;
      })

      // Register
      .addCase(register.fulfilled, (state, action) => {
        state.registerMessage = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

