import { SingleStudentDataFromFirebase } from "../../../../utils/interfaces"
import { SingleGradeRow } from "./SingleGradeRow"

interface GradesTableProps {
    students: SingleStudentDataFromFirebase[]
}

export const GradesTable: React.FC<GradesTableProps> = ({ students }) => {
    return (
        <table className="table w-full">
            <thead>
                <tr className="">
                    <th className="w-1">Nr</th> 
                    <th className="w-1">Nazwisko Imię</th> 
                    <th>Oceny</th>
                    <th className="w-1 text-center">Średnia ocen</th>
                    <th className="w-1 text-center">Ocena semestralna</th>
                </tr>
            </thead> 
            <tbody>
                {students.map((item, index) => (
                    <SingleGradeRow key={item.email} student={item} number={index + 1} />
                ))}
            </tbody>
        </table>
    )
}