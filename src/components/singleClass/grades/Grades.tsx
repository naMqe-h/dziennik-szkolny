import { StudentsDataFromFirebase } from "../../../utils/interfaces"
import { SingleStudentGradeRow } from "./SingleStudentGradeRow";

interface GradesProps {
    studentsInfo: StudentsDataFromFirebase,
}

export const Grades: React.FC<GradesProps> = ({ studentsInfo }) => {
    const students = Object.values(studentsInfo)

    return (
        <div className="overflow-x-auto">
            {students.map((student, index) => (
                <SingleStudentGradeRow key={student.email} student={student} number={index + 1} />
            ))}
        </div>
    )
}