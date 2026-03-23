// ─────────────────────────────────────────
// FILE: src/redux/slices/authSlice.js
// Handles login, register, logout state
// ─────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerUserApi } from '../../services/api';
import toast from 'react-hot-toast';

// Load initial state from localStorage (persist login)
const token    = localStorage.getItem('token');
const user     = JSON.parse(localStorage.getItem('user') || 'null');

// ── Async thunks ──────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(userData);
      return res.data.data;
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).join(', ')
        : err.response?.data?.message || 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

// ── Slice ─────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    user,
    token:   token,
    loading: false,
    error:   null,
  },
  reducers: {
    logout: (state) => {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user    = a.payload;
        s.token   = a.payload.token;
        localStorage.setItem('token', a.payload.token);
        localStorage.setItem('user',  JSON.stringify(a.payload));
        toast.success(`Welcome back, ${a.payload.fullName}!`);
      })
      .addCase(loginUser.rejected,  (s, a) => {
        s.loading = false;
        s.error   = a.payload;
        toast.error(a.payload);
      })
      // Register
      .addCase(registerUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(registerUser.fulfilled, (s) => {
        s.loading = false;
        toast.success('Account created! Please login.');
      })
      .addCase(registerUser.rejected,  (s, a) => {
        s.loading = false;
        s.error   = a.payload;
        toast.error(a.payload);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
