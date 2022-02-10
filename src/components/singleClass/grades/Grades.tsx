import { Dispatch, SetStateAction } from "react";
import { SingleStudentDataFromFirebase as SSDFF, StudentsDataFromFirebase } from "../../../utils/interfaces"
import { Modal } from "./add/Modal";
import { SingleStudentGradeRow } from "./SingleStudentGradeRow";

interface GradesProps {
    studentsInfo: StudentsDataFromFirebase,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

export const Grades: React.FC<GradesProps> = ({ studentsInfo, isOpen, setIsOpen }) => {
    const tempStudents = Object.values(studentsInfo)
    const students = tempStudents.sort((a: SSDFF, b: SSDFF) => a.lastName.localeCompare(b.lastName, "pl"))

    return (
        <>
            <Modal setIsOpen={setIsOpen} isOpen={isOpen} students={students} studentsInfo={studentsInfo} />
            {/* //! zmienic widok dla nauczyciela na jeden przedmiot */}
            <div className="overflow-x-auto">
                {students.map((student, index) => (
                    <SingleStudentGradeRow key={student.email} student={student} number={index + 1} />
                    ))}
            </div>
        </>
    )
}