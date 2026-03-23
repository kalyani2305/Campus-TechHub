// ─────────────────────────────────────────
// FILE: src/redux/slices/studentsSlice.js
// ─────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllStudentsApi, deleteStudentApi, registerStudentApi } from '../../services/api';
import toast from 'react-hot-toast';

export const fetchStudents = createAsyncThunk('students/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await getAllStudentsApi(); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const registerStudent = createAsyncThunk('students/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerStudentApi(data);
    toast.success('Student registered!');
    return res.data.data;
  } catch (err) {
    const errors = err.response?.data?.errors;
    const msg = errors ? Object.values(errors).join(', ') : err.response?.data?.message;
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const deleteStudent = createAsyncThunk('students/delete', async (id, { rejectWithValue }) => {
  try { await deleteStudentApi(id); toast.success('Student deleted'); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const studentsSlice = createSlice({
  name: 'students',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending,   (s) => { s.loading = true; })
      .addCase(fetchStudents.fulfilled, (s, a) => { s.loading = false; s.list = a.payload || []; })
      .addCase(fetchStudents.rejected,  (s) => { s.loading = false; })
      .addCase(registerStudent.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(deleteStudent.fulfilled,   (s, a) => { s.list = s.list.filter(x => x.id !== a.payload); });
  },
});

export default studentsSlice.reducer;
