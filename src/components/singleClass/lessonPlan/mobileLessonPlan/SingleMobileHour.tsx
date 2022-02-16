import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  singleHoursFromLessonPlan,
  SingleTeacherData,
  SubjectData,
} from "../../../../utils/interfaces";

interface SingleMobileHour {
  isEmpty: boolean;
  index: number;
  lesson?: singleHoursFromLessonPlan;
}
export const SingleMobileHour: React.FC<SingleMobileHour> = ({
  lesson,
  isEmpty,
  index,
}) => {
  const teachers = useSelector(
    (state: RootState) => state.schoolData.schoolData?.teachers
  );
  const subjects = useSelector(
    (state: RootState) => state.schoolData.schoolData?.subjects
  );
  const [teacher, setTeacher] = useState<SingleTeacherData>();
  const [subject, setSubject] = useState<SubjectData>();
  useEffect(() => {
    if (teachers) {
      for (const [key, value] of Object.entries(teachers)) {
        if (key === lesson?.teacher) setTeacher(value);
      }
    }
  }, [teachers, isEmpty, lesson?.teacher]);

  useEffect(() => {
    if (subjects) {
      for (const [key, value] of Object.entries(subjects)) {
        if (key === lesson?.subject) setSubject(value);
      }
    }
  }, [subjects, isEmpty, lesson?.subject]);
  console.log(lesson?.hour, lesson?.subject);
  return (
    <div className="border-2 relative border-base-200 w-60 h-24 flex flex-col items-center justify-center">
      <div className="absolute  text-center text-primary px-2 py-1 border-r-2 border-b-2 border-solid border-primary  top-0 left-0">
        {index + 1}
      </div>
      <h1 className="text-lg font-bold mt-6">
        {lesson?.subject === "GodzinaWychowawcza"
          ? "Godzina wychowawcza"
          : isEmpty
          ? ""
          : subject?.name}
      </h1>
      <span className="text-sm text-gray-500">
        {isEmpty
          ? ""
          : `${teacher?.lastName || ""} ${teacher?.firstName || ""}`}
      </span>
    </div>
  );
};
