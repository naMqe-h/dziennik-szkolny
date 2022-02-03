import { configureStore } from "@reduxjs/toolkit";
import principalReducer from "./principalSlice";
import teacherSlice from "./teacherSlice";
import studentSlice from "./studentSlice";
import userTypeSlice from "./userTypeSlice";
import schoolDataSlice from "./schoolDataSlice";

export const store = configureStore({
  reducer: {
    principal: principalReducer,
    teacher: teacherSlice,
    student: studentSlice,
    userType: userTypeSlice,
    schoolData: schoolDataSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
