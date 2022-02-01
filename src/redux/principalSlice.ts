import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { CombinedPrincipalData, CombinedSchoolDataFromFirebase } from "../utils/interfaces";
import type { RootState } from "./store";
interface PrincipalState {
  user: User | null;
  data: null | CombinedPrincipalData ;
  schoolData: CombinedSchoolDataFromFirebase | null;
}

const initialState: PrincipalState = {
  user: null,
  data: null,
  schoolData: null,
};
export const principalSlice = createSlice({
  name: "principal",
  initialState,
  reducers: {
    setPrincipalAuth: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setPrincipalData: (
      state,
      action: PayloadAction<CombinedPrincipalData>
    ) => {
      state.data = action.payload;
    },
    setSchoolData: (
      state,
      action: PayloadAction<CombinedSchoolDataFromFirebase>
    ) => {
      state.schoolData = action.payload;
    },
    logout: () => initialState,
  },
});

export const {
  setPrincipalAuth,
  setPrincipalData,
  setSchoolData,
  logout,
} = principalSlice.actions;
export const selectUser = (state: RootState) => state;
export default principalSlice.reducer;
