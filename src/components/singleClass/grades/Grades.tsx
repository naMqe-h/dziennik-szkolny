import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  SingleStudentDataFromFirebase as SSDFF,
  StudentsDataFromFirebase,
  termType,
} from "../../../utils/interfaces";
import { Modal } from "./add/Modal";
import { SingleStudentGradeRow } from "./SingleStudentGradeRow";
import { GradesTable } from "./teacherView/GradesTable";

interface GradesProps {
  studentsInfo: StudentsDataFromFirebase;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  term: termType;
}

export const Grades: React.FC<GradesProps> = ({
  studentsInfo,
  isOpen,
  setIsOpen,
  term,
}) => {
  const tempStudents = Object.values(studentsInfo);
  const students = tempStudents.sort((a: SSDFF, b: SSDFF) =>
    a.lastName.localeCompare(b.lastName, "pl")
  );
  const userType = useSelector((state: RootState) => state.userType.userType);

  return (
    <>
      <Modal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        students={students}
        studentsInfo={studentsInfo}
      />
      <div className="overflow-x-auto">
        {userType === "teachers" && (
          <GradesTable students={students} term={term} />
        )}
        {userType === "principals" &&
          students.map((student, index) => (
            <SingleStudentGradeRow
              key={student.email}
              student={student}
              number={index + 1}
              term={term}
            />
          ))}
      </div>
    </>
  );
};
