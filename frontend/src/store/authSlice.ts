import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null | undefined;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Define the loginUser thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData: { email: string; password: string }) => {
    // Make a POST request to the login endpoint
    const response = await axios.post('http://localhost:5000/api/login', userData);
    // Extract the token from the response
    const token = response.data.token;
    // Store the token in local storage
    localStorage.setItem('token', token);
    console.log(token);
    // Return the response data
    return response.data;
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for pending, fulfilled, and rejected actions
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default authSlice.reducer;
