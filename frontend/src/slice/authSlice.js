import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/users/signup', userData);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.error); 
    } else {
      return rejectWithValue('Signup failed');
    }
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/users/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token); 
    const decodedToken = jwtDecode(token);
    return decodedToken; 
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.error); 
    } else {
      return rejectWithValue('Login failed');
    }
  }
});

const initialState = {
  loading: false,
  error: null,
  user: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null; 
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload; 
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          role: action.payload.role,
        }; 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;

