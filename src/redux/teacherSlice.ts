import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { SingleClassData, SingleTeacherData, userType } from "../utils/interfaces";
import { RootState } from "./store";

interface teacherState {
    user: User | null;
    userType: userType | undefined;
    data: SingleTeacherData | null;
    teachedClassesInfo: SingleClassData[] | null
}

const initialState: teacherState = {
    user: null,
    userType: undefined,
    data: null,
    teachedClassesInfo: null,
}

export const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {
        setUserType: (state, action: PayloadAction<userType>) => {
            state.userType = action.payload;
        },
        setUserAuth: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setTeacherData: (state, action: PayloadAction<SingleTeacherData>) => {
            state.data = action.payload
        },
        setTeachedClassesInfo: (state, action: PayloadAction<SingleClassData[]>) => {
            state.teachedClassesInfo = action.payload
        },
        logout: () => initialState,
    }
})

export const {
    setUserType,
    setUserAuth,
    setTeacherData,
    setTeachedClassesInfo,
    logout,
} = teacherSlice.actions
export const selectUser = (state: RootState) => state;
export default teacherSlice.reducer;