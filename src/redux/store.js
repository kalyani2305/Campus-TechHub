// ─────────────────────────────────────────
// FILE: src/redux/store.js
// Redux Toolkit store — combines all slices
// ─────────────────────────────────────────
import { configureStore } from '@reduxjs/toolkit';
import authReducer         from './slices/authSlice';
import jobsReducer         from './slices/jobsSlice';
import applicationsReducer from './slices/applicationsSlice';
import interviewsReducer   from './slices/interviewsSlice';
import studentsReducer     from './slices/studentsSlice';

const store = configureStore({
  reducer: {
    auth:         authReducer,
    jobs:         jobsReducer,
    applications: applicationsReducer,
    interviews:   interviewsReducer,
    students:     studentsReducer,
  },
});

export default store;
