import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import {
  CombinedPrincipalData,
  userType,
  CombinedSchoolDataFromFirebase,
} from "../utils/interfaces";
import type { RootState } from "./store";
interface PrincipalState {
  user: User | null;
  userType: userType | undefined;
  data: null | CombinedPrincipalData ;
  schoolData: CombinedSchoolDataFromFirebase | null;
}

const initialState: PrincipalState = {
  user: null,
  userType: undefined,
  data: null,
  schoolData: null,
};
export const principalSlice = createSlice({
  name: "principal",
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<userType>) => {
      state.userType = action.payload;
    },
    setUserAuth: (state, action: PayloadAction<User>) => {
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
  setUserType,
  setUserAuth,
  setPrincipalData,
  setSchoolData,
  logout,
} = principalSlice.actions;
export const selectUser = (state: RootState) => state;
export default principalSlice.reducer;
