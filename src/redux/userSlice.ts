import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import {
  CombinedPrincipalData,
  userType,
  CombinedSchoolDataFromFirebase,
  StudentData,
  TeachersDataFromFirebase,
  StudentsDataFromFirebase,
  ClassesDataFromFirebase,
  SubjectData,
  SchoolSubjectsDataFromFirebase,
} from "../utils/interfaces";
import type { RootState } from "./store";
interface UserState {
  user: User | null;
  data: null | CombinedPrincipalData ;
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
    setUserData: (
      state,
      action: PayloadAction<CombinedPrincipalData>
    ) => {
      const data = action.payload;
      state.data = data;
    },
    setSchoolData: (
      state,
      action: PayloadAction<CombinedSchoolDataFromFirebase>
    ) => {
      const schoolData = action.payload;
      state.schoolData = schoolData;
    },
    addNewTeacher: (state, action: PayloadAction<TeachersDataFromFirebase>) => {
      const subjectName = Object.values(action.payload)[0].subject;
      const teachersOBJ = Object.values(action.payload)[0];

      if (state.schoolData) {
        const subjectObj = state.schoolData.subjects[subjectName].teachers;
        console.log(action.payload);
        state.schoolData.teachers = {
          ...state.schoolData.teachers,
          ...action.payload,
        };
        state.schoolData.subjects = {
          ...state.schoolData.subjects,
          [subjectName]: {
            ...state.schoolData.subjects[subjectName],
            teachers: [...subjectObj, teachersOBJ.email],
          },
        };
      }
    },
    addNewStudent: (state, action: PayloadAction<StudentsDataFromFirebase>) => {
      if (state.schoolData) {
        state.schoolData.students = {
          ...state.schoolData.students,
          ...action.payload,
        };
      }
    },
    addNewClass: (state, action: PayloadAction<ClassesDataFromFirebase>) => {
      if (state.schoolData) {
        const teacherMail = Object.values(action.payload)[0].classTeacher;
        const classTeacher = Object.values(action.payload)[0].name;

        state.schoolData.classes = {
          ...state.schoolData.classes,
          ...action.payload,
        };
        state.schoolData.teachers = {
          ...state.schoolData.teachers,
          [teacherMail]: {
            ...state.schoolData.teachers[teacherMail],
            classTeacher,
          },
        };
      }
    },
    addNewSubject: (
      state,
      action: PayloadAction<SchoolSubjectsDataFromFirebase>
    ) => {
      if (state.schoolData) {
        state.schoolData.subjects = {
          ...state.schoolData.subjects,
          ...action.payload,
        };
      }
    },
    logout: () => initialState,
  },
});

export const {
  setUserType,
  setUserAuth,
  setUserData,
  setSchoolData,
  logout,
  addNewTeacher,
  addNewStudent,
  addNewClass,
  addNewSubject,
} = userSlice.actions;
export const selectUser = (state: RootState) => state;
export default userSlice.reducer;
