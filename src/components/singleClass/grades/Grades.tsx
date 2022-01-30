import { SingleStudentDataFromFirebase, StudentsDataFromFirebase } from "../../../utils/interfaces"
import { SingleStudentGradeRow } from "./SingleStudentGradeRow";

interface GradesProps {
    studentsInfo: StudentsDataFromFirebase,
}

export const Grades: React.FC<GradesProps> = ({ studentsInfo }) => {
    const tempStudents = Object.values(studentsInfo)

    const students = tempStudents.sort(
        (a: SingleStudentDataFromFirebase, b: SingleStudentDataFromFirebase) =>
            a.lastName.localeCompare(b.lastName, "pl")
    );
    
    
    console.log(students)

    return (
        <div className="overflow-x-auto">
            {students.map((student, index) => (
                <SingleStudentGradeRow key={student.email} student={student} number={index + 1} />
            ))}
        </div>
    )
}