// ─────────────────────────────────────────
// FILE: src/redux/slices/applicationsSlice.js
// ─────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllApplicationsApi, applyJobApi, updateAppStatusApi, getMyApplicationsApi } from '../../services/api';
import toast from 'react-hot-toast';

export const fetchAllApplications = createAsyncThunk('apps/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await getAllApplicationsApi(); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyApplications = createAsyncThunk('apps/fetchMine', async (studentId, { rejectWithValue }) => {
  try { const res = await getMyApplicationsApi(studentId); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const applyForJob = createAsyncThunk('apps/apply', async ({ studentId, jobPostingId }, { rejectWithValue }) => {
  try {
    const res = await applyJobApi(studentId, jobPostingId);
    toast.success('Application submitted!');
    return res.data.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Already applied';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const updateApplicationStatus = createAsyncThunk('apps/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await updateAppStatusApi(id, status);
    toast.success(`Application ${status.toLowerCase()}!`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: { list: [], myList: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllApplications.pending,   (s) => { s.loading = true; })
      .addCase(fetchAllApplications.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchAllApplications.rejected,  (s) => { s.loading = false; })
      .addCase(fetchMyApplications.fulfilled,  (s, a) => { s.myList = a.payload || []; })
      .addCase(applyForJob.fulfilled,          (s, a) => { s.myList.unshift(a.payload); })
      .addCase(updateApplicationStatus.fulfilled, (s, a) => {
        const i = s.list.findIndex(x => x.id === a.payload.id);
        if (i !== -1) s.list[i] = a.payload;
      });
  },
});

export default applicationsSlice.reducer;
