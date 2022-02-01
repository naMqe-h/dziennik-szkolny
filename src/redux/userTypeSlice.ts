import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userType } from "../utils/interfaces";
import { RootState } from "./store";

interface userTypeState {
    userType: userType | undefined | string;
}

const initialState: userTypeState = {
    userType: undefined,
}

export const userTypeSlice = createSlice({
    name: "userType",
    initialState,
    reducers: {
        setUserType: (state, action: PayloadAction<userType>) => {
            state.userType = action.payload;
        },
        clearUserType: () => initialState,
    }
})

export const { setUserType, clearUserType } = userTypeSlice.actions
export const selectUser = (state: RootState) => state;
export default userTypeSlice.reducer;