import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { SingleStudentDataFromFirebase, userType } from "../utils/interfaces";
import { RootState } from "./store";

interface studentState {
    user: User | null;
    userType: userType | undefined;
    data: SingleStudentDataFromFirebase | null;
}

const initialState: studentState = {
    user: null,
    userType: undefined,
    data: null,
}

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setUserType: (state, action: PayloadAction<userType>) => {
            state.userType = action.payload;
        },
        setUserAuth: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setStudentData: (state, action: PayloadAction<SingleStudentDataFromFirebase>) => {
            state.data = action.payload
        },
        logout: () => initialState,
    }
})

export const {
    setUserType,
    setUserAuth,
    setStudentData,
    logout,
} = studentSlice.actions
export const selectUser = (state: RootState) => state;
export default studentSlice.reducer;