import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { CombinedPrincipalData } from "../utils/interfaces";
import type { RootState } from "./store";
interface PrincipalState {
  user: User | null;
  data: null | CombinedPrincipalData ;
}

const initialState: PrincipalState = {
  user: null,
  data: null,
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
    logout: () => initialState,
  },
});

export const {
  setPrincipalAuth,
  setPrincipalData,
  logout,
} = principalSlice.actions;
export const selectUser = (state: RootState) => state;
export default principalSlice.reducer;
