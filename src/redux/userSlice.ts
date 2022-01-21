import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { CombinedPrincipalData, userType, CombinedSchoolDataFromFirebase, StudentData,TeachersDataFromFirebase, StudentsDataFromFirebase } from "../utils/interfaces";
import type { RootState } from "./store";
interface UserState {
  user: User | null;
  data: null | CombinedPrincipalData | StudentData;
  userType: userType | undefined;
  schoolData: CombinedSchoolDataFromFirebase | null;
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
    setUserData: (state, action: PayloadAction<CombinedPrincipalData | StudentData>) => {
      const data = action.payload;
      state.data = data;
    },
    setSchoolData: (state, action: PayloadAction<CombinedSchoolDataFromFirebase>) => {
      const schoolData = action.payload;
      state.schoolData = schoolData;
    },
    addNewTeacher:(state,action:PayloadAction<TeachersDataFromFirebase>) => {
     if(state.schoolData){
      state.schoolData.teachers=action.payload
     }
    },
    addNewStudent:(state, action:PayloadAction<StudentsDataFromFirebase>) => {
      if(state.schoolData){
        state.schoolData.students=action.payload;
      }
    },
    logout: () => initialState,
  },
});

export const { setUserType, setUserAuth, setUserData, setSchoolData, logout, addNewTeacher, addNewStudent } =
  userSlice.actions;
export const selectUser = (state: RootState) => state;
export default userSlice.reducer;
