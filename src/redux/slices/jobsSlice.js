// ─────────────────────────────────────────
// FILE: src/redux/slices/jobsSlice.js
// ─────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createJobApi, getAllJobsApi, deleteJobApi, updateJobApi } from '../../services/api';
import toast from 'react-hot-toast';

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (branch, { rejectWithValue }) => {
  try {
    const res = await getAllJobsApi(branch);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createJob = createAsyncThunk('jobs/create', async (data, { rejectWithValue }) => {
  try {
    const res = await createJobApi(data);
    toast.success('Job posted successfully!');
    return res.data.data;
  } catch (err) {
    const errors = err.response?.data?.errors;
    const msg = errors ? Object.values(errors).join(', ') : err.response?.data?.message;
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteJob = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteJobApi(id);
    toast.success('Job deleted');
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateJob = createAsyncThunk('jobs/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateJobApi(id, data);
    toast.success('Job updated!');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending,    (s) => { s.loading = true; })
      .addCase(fetchJobs.fulfilled,  (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchJobs.rejected,   (s) => { s.loading = false; })
      .addCase(createJob.fulfilled,  (s, a) => { s.list.unshift(a.payload); })
      .addCase(deleteJob.fulfilled,  (s, a) => { s.list = s.list.filter(j => j.id !== a.payload); })
      .addCase(updateJob.fulfilled,  (s, a) => {
        const i = s.list.findIndex(j => j.id === a.payload.id);
        if (i !== -1) s.list[i] = a.payload;
      });
  },
});

export default jobsSlice.reducer;
