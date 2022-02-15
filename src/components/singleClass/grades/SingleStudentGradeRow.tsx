import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { RootState } from "../../../redux/store";
import {
  SchoolGrade,
  SingleStudentDataFromFirebase,
  termType,
} from "../../../utils/interfaces";
import { SingleGradeRow } from "./SingleGradeRow";

interface SingleStudentGradeRowProps {
  student: SingleStudentDataFromFirebase;
  number: number;
  term: termType;
}

export const SingleStudentGradeRow: React.FC<SingleStudentGradeRowProps> = ({
  student,
  number,
  term,
}) => {
  const state = useSelector((state: RootState) => state.schoolData);
  const [studentGrades, setStudentGrades] = useState<{
    [key: string]: SchoolGrade[];
  }>({});
  const isMobile = useMediaQuery("(max-width:768px)");
  useEffect(() => {
    if (student && state.schoolData?.teachers) {
      const newGrades: { [key: string]: SchoolGrade[] } = {};
      const teachersSubjectsArray: string[] = [];
      Object.values(state.schoolData?.teachers).forEach((item) => {
        if (item.teachedClasses.some((x) => x === student.class)) {
          teachersSubjectsArray.push(item.subject);
        }
      });
      teachersSubjectsArray
        .sort((a, b) => a.localeCompare(b))
        .forEach((item) => {
          if (student.grades[item]) {
            newGrades[item] = student.grades[item];
          } else {
            newGrades[item] = [];
          }
        });
      setStudentGrades(newGrades);
    }
  }, [state.schoolData?.teachers, student]);
  return (
    <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {number} {student.lastName} {student.firstName}
      </div>
      <div className="collapse-content">
        <table className="table w-full">
          <thead>
            <tr className="">
              <th className="w-1">Nazwa przedmiotu</th>
              <th>Oceny</th>
              {!isMobile && <th className="w-1">Średnia ocen</th>}
              {!isMobile && <th className="w-1">Ocena semestralna</th>}
            </tr>
          </thead>
          <tbody>
            {Object.entries(studentGrades).map((item) => (
              <SingleGradeRow
                key={item[0]}
                subject={item[0]}
                grades={item[1].filter((x) => x.term === term) ?? []}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
