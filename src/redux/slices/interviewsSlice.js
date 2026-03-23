// ─────────────────────────────────────────
// FILE: src/redux/slices/interviewsSlice.js
// ─────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleInterviewApi, getAllInterviewsApi, getMyInterviewApi } from '../../services/api';
import toast from 'react-hot-toast';

export const fetchAllInterviews = createAsyncThunk('interviews/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await getAllInterviewsApi(); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyInterview = createAsyncThunk('interviews/fetchMine', async (studentId, { rejectWithValue }) => {
  try { const res = await getMyInterviewApi(studentId); return res.data.data; }
  catch (err) { return rejectWithValue(null); }
});

export const scheduleInterview = createAsyncThunk('interviews/schedule', async (data, { rejectWithValue }) => {
  try {
    const res = await scheduleInterviewApi(data);
    toast.success('Interview scheduled!');
    return res.data.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to schedule';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState: { list: [], myInterview: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInterviews.pending,   (s) => { s.loading = true; })
      .addCase(fetchAllInterviews.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchAllInterviews.rejected,  (s) => { s.loading = false; })
      .addCase(fetchMyInterview.fulfilled,   (s, a) => { s.myInterview = a.payload; })
      .addCase(scheduleInterview.fulfilled,  (s, a) => { s.list.unshift(a.payload); });
  },
});

export default interviewsSlice.reducer;
