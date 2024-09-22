import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const createRequest = createAsyncThunk('requests/create', async (requestData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/requests', requestData);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message); 
    } else {
      return rejectWithValue('Failed to create request');
    }
  }
});

export const getUserRequests = createAsyncThunk('requests/getUserRequests', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/requests/user');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message); 
    } else {
      return rejectWithValue('Failed to fetch user requests');
    }
  }
});

export const getRequests = createAsyncThunk('requests/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/requests');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message); 
    } else {
      return rejectWithValue('Failed to fetch requests');
    }
  }
});

export const updateRequest = createAsyncThunk('requests/update', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/requests/${id}`, { status });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message); 
    } else {
      return rejectWithValue('Failed to update request');
    }
  }
});

export const assignHardware = createAsyncThunk('requests/assignHardware', async ({ requestId, qrCode }, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/requests/assign', { requestId, qrCode });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message); 
    } else {
      return rejectWithValue('Failed to assign hardware');
    }
  }
});

export const detachHardware = createAsyncThunk('requests/detachHardware', async ({ requestId, qrCode }, { rejectWithValue }) => {
  try {
    console.log(requestId, qrCode)
    const response = await api.post('/api/requests/detach', { requestId, qrCode });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message); 
    } else {
      return rejectWithValue('Failed to detach hardware');
    }
  }
});

export const fetchHardwareOptions = createAsyncThunk('requests/fetchHardwareOptions', async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/requests/hardware');
      const hardwareOptions = response.data.map(hardware => ({
        label: hardware.name,  // Display name
        value: hardware._id,   // Unique identifier
      }));
      return hardwareOptions;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to fetch hardware options');
      }
    }
  });

const initialState = {
  loading: false,
  error: null,
  requests: [],
  userRequests: [],
  hardwareOptions: [],
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequests.push(action.payload);
        state.error = null;
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequests = action.payload;
        state.error = null;
      })
      .addCase(getUserRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
        state.error = null;
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignHardware.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignHardware.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(r => r._id === action.payload.request._id);
        if (index !== -1) {
          state.requests[index].hardwareId = action.payload.request.hardwareId;
          state.requests[index].status = 'accepted';
        }
        state.error = null;
      })
      .addCase(assignHardware.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(detachHardware.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detachHardware.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(r => r._id === action.payload.request._id);
        if (index !== -1) {
          state.requests[index].hardwareId = null;
          state.requests[index].status = 'detached';
        }
        state.error = null;
      })
      .addCase(detachHardware.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHardwareOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHardwareOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.hardwareOptions = action.payload;
        state.error = null;
      })
      .addCase(fetchHardwareOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestSlice.reducer;
