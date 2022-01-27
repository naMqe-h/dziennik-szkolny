import { SingleSubjectInClasses } from "../../../utils/interfaces"
import { SubjectRow } from "./SubjectRow"

interface SubjectsProps {
    subjects: SingleSubjectInClasses[] | undefined
}

export const Subjects: React.FC<SubjectsProps> = ({ subjects }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th className="w-1">Nr</th> 
                        <th>Nazwa przedmiotu</th> 
                        <th>Nauczyciel uczący</th> 
                        <th className="w-1">Liczone do średniej</th>
                    </tr>
                </thead> 
                <tbody>
                    {subjects?.map((subject, index) => (
                        <SubjectRow key={subject.name} subject={subject} number={index + 1} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}