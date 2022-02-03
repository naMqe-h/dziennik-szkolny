import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CombinedSchoolDataFromFirebase } from "../utils/interfaces";
import type { RootState } from "./store";
interface schoolDataState {
  schoolData: CombinedSchoolDataFromFirebase | null;
}

const initialState: schoolDataState = {
  schoolData: null,
};
export const schoolDataSlice = createSlice({
  name: "schoolData",
  initialState,
  reducers: {
    setSchoolData: (
      state,
      action: PayloadAction<CombinedSchoolDataFromFirebase>
    ) => {
      state.schoolData = action.payload;
    }
  },
});

export const { setSchoolData } = schoolDataSlice.actions;
export const selectUser = (state: RootState) => state;
export default schoolDataSlice.reducer;
