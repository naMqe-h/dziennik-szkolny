import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { SingleStudentDataFromFirebase } from "../utils/interfaces";
import { RootState } from "./store";

interface studentState {
    user: User | null;
    data: SingleStudentDataFromFirebase | null;
}

const initialState: studentState = {
    user: null,
    data: null,
}

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setStudentAuth: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setStudentData: (state, action: PayloadAction<SingleStudentDataFromFirebase>) => {
            state.data = action.payload
        },
        logout: () => initialState,
    }
})

export const {
    setStudentAuth,
    setStudentData,
    logout,
} = studentSlice.actions
export const selectUser = (state: RootState) => state;
export default studentSlice.reducer;