import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  singleHoursFromLessonPlan,
  SingleTeacherData,
  SubjectData,
} from "../../utils/interfaces";

interface SingleHourProps {
  isEmpty: boolean;
  lesson?: singleHoursFromLessonPlan;
}

export const SingleHour: React.FC<SingleHourProps> = ({ lesson, isEmpty }) => {
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

  return (
    <td className="border-2 border-base-200">
      <div>
        <h1 className="text-lg font-bold">
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
    </td>
  );
};
