import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useAverage } from "../../../../hooks/useAverage"
import { RootState } from "../../../../redux/store"
import { SchoolGrade, SingleStudentDataFromFirebase } from "../../../../utils/interfaces"
import { SingleGrade } from "../SingleGrade"

interface SingleGradeRowProps {
    student: SingleStudentDataFromFirebase,
    number: number
}

export const SingleGradeRow: React.FC<SingleGradeRowProps> = ({ student, number }) => {
    const { calculateAvg } = useAverage()

    const subject = useSelector((state: RootState) => state.teacher.data?.subject)
    const [grades, setGrades] = useState<SchoolGrade[]>([])
    const [avg, setAvg] = useState<string>()

    useEffect(() => {
        setGrades(student.grades[subject as string])
        // eslint-disable-next-line
    }, [student])

    useEffect(() => {
        if(grades?.length > 0) {
            const tempAvg = calculateAvg(grades)
            setAvg(tempAvg)
        } else {
            setAvg("0.00");
        }
        // eslint-disable-next-line 
    }, [grades])

    return (
        <tr>
            <td>{number}</td>
            <td>{student.lastName} {student.firstName}</td>
            <td className="flex flex-wrap gap-y-2">
                {grades ? grades?.map((grade, index) => (
                    <SingleGrade key={index} grade={grade} />
                )) : 'Brak ocen'}
            </td>
            <td className={`text-${avg && +avg > 0 && +avg < 2 ? 'error' : 'success'} font-bold text-center`}>{avg}</td>
            <td className="text-center">
                <div className="badge font-bold">-</div>
            </td>
        </tr>
    )
}