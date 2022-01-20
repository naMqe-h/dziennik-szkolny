import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { CombinedPrincipalData, userType } from "../utils/interfaces";
import type { RootState } from "./store";
interface UserState {
  user: User | null;
  data: null | CombinedPrincipalData;
  userType: userType | undefined;
  schoolData: null;
}

const initialState: UserState = {
  user: null,
  data: null,
  userType: undefined,
  schoolData: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<userType>) => {
      const userType = action.payload;
      state.userType = userType;
    },
    setUserAuth: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
    },
    setUserData: (state, action: PayloadAction<CombinedPrincipalData>) => {
      const data = action.payload;
      state.data = data;
    },
    logout: () => initialState,
  },
});

export const { setUserType, setUserAuth, setUserData, logout } =
  userSlice.actions;
export const selectUser = (state: RootState) => state;
export default userSlice.reducer;
