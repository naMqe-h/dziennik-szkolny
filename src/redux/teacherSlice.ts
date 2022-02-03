import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { SingleTeacherData } from "../utils/interfaces";
import { RootState } from "./store";

interface teacherState {
    user: User | null;
    data: SingleTeacherData | null;
}

const initialState: teacherState = {
    user: null,
    data: null,
}

export const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {
        setTeacherAuth: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setTeacherData: (state, action: PayloadAction<SingleTeacherData>) => {
            state.data = action.payload
        },
        logout: () => initialState,
    }
})

export const {
    setTeacherAuth,
    setTeacherData,
    logout,
} = teacherSlice.actions
export const selectUser = (state: RootState) => state;
export default teacherSlice.reducer;